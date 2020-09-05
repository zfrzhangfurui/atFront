import { Component, OnInit } from '@angular/core';
import { UserService } from '../../user.service';
import { pluck, switchMap, tap, debounceTime, distinctUntilChanged, share, withLatestFrom } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { of, BehaviorSubject, Subject, combineLatest } from 'rxjs';
import { FormBuilder, FormGroup, FormControl, RequiredValidator, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { MemberHttpResponse } from '../../../../interface/member.interface';
import { NzTableQueryParams } from 'ng-zorro-antd/table';


@Component({
  selector: 'app-member',
  templateUrl: './member.page.html',
  styleUrls: ['./member.page.less']
})
export class MemberPage implements OnInit {
  total: number = 0;
  pageIndex: number = 1;
  pageSize: number = 6;
  userInfo$ = this.userService.userInfo$.subscribe(data => {
    console.log(data);
  })
  onFilteMember(value) {
    this.filter$.next(value);
  }

  filter$: BehaviorSubject<string> = new BehaviorSubject('');
  filterProcessed$ = this.filter$.pipe(debounceTime(500), distinctUntilChanged(), share());
  filterProcessedResult$ = this.filterProcessed$.pipe(debounceTime(20)).subscribe(() => { this.pageIndex = 1; this.refreshTable$.next(1) })

  refreshTable$: Subject<number> = new Subject();
  memberTable$ = this.refreshTable$.pipe(withLatestFrom(this.filterProcessed$), switchMap(([pageIndex, pattern]) => {
    console.log(pattern);
    return this.http.get<MemberHttpResponse>(`/member/get_members?pattern=${pattern}&page=${pageIndex}&limit=${this.pageSize}`).pipe(tap(data => {
      this.total = data.count;
      console.log(data);
    }), pluck('list'), switchMap(data => {
      let data_clone = [...data];
      if (data.length < this.pageSize) {
        for (let i = 0; i < this.pageSize - data.length; i++) {
          data_clone.push({ type: 'Dummy' })
        }

      }
      return of(data_clone);
    }))
  }))

  onQueryParamsChange(params: NzTableQueryParams) {
    let { pageIndex } = params;
    pageIndex = +pageIndex;
    console.log(pageIndex);
    this.pageIndex = pageIndex;
    this.refreshTable$.next(pageIndex);
  }
  memberForm: FormGroup = this.fb.group({
    firstName: new FormControl(null, [Validators.required]),
    lastName: new FormControl(null, [Validators.required]),
    address: new FormControl(null, [Validators.required]),

  })

  isVisible: boolean = false;

  addMember() {
    if (this.memberForm.valid) {
      const value = this.memberForm.value;
      const name = value.firstName.trim() + ' ' + value.lastName.trim();
      const pageIndex = this.pageIndex;
      this.http.put('/member/add_member', { name, address: value.address }).subscribe(data => {
        this.message.success('New member has been created, please check in Member Table!', { nzDuration: 3000 });
        this.memberForm.reset();
        this.refreshTable$.next(pageIndex);
        this.isVisible = false;
      }, err => { this.message.error(err, { nzDuration: 50000, nzPauseOnHover: true }); })
    }
  }

  edit_id: string;
  editName: string;
  editAddress: string;
  startEdit(data): void {
    console.log('dao zhe la !');
    this.edit_id = data._id;
    this.editName = data.name;
    this.editAddress = data.address;
  }
  confirmEdit() {
    const name = this.editName;
    const address = this.editAddress;
    const member_id = this.edit_id;

    const pageIndex = this.pageIndex;
    this.http.put('/member/edit_member', { name, address, member_id }).subscribe(_ => {
      this.message.success(`member has been edit successfully!`, { nzDuration: 3000 });
      this.editName = null;
      this.editAddress = null;
      this.edit_id = null;
      this.refreshTable$.next(pageIndex);
    })
  }
  cancelEdit() {
    this.edit_id = null;
    this.editName = null;
    this.editAddress = null;
  }

  setStatus(data) {
    let statusSetTo = data.status === 'active' ? 'deactived' : 'active';
    const pageIndex = this.pageIndex;
    console.log(data);
    this.http.put('/member/set_status', { statusSetTo, community_id: data.community_id, member_id: data._id }).subscribe(res => {
      this.message.success(`member: ${data.name} has been ${statusSetTo} successfully!`, { nzDuration: 3000 });
      this.refreshTable$.next(pageIndex);
    })
    console.log(data);
  }
  constructor(
    private userService: UserService,
    private http: HttpClient,
    private fb: FormBuilder,
    private message: NzMessageService
  ) { }

  ngOnInit(): void {
  }

}
