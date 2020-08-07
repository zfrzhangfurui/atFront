import { Component, OnInit } from '@angular/core';
import { UserService } from '../../user.service';
import { pluck, switchMap, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { of, BehaviorSubject, Subject } from 'rxjs';
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
  refreshTable$: Subject<number> = new Subject();
  memberTable$ = this.refreshTable$.pipe(switchMap((pageIndex) => {
    return this.http.get<MemberHttpResponse>(`/member/get_members?pattern=&page=${pageIndex}&limit=${this.pageSize}`).pipe(tap(data => {
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
    this.refreshTable$.next(pageIndex)
  }
  memberForm: FormGroup = this.fb.group({
    firstName: new FormControl(null, [Validators.required]),
    lastName: new FormControl(null, [Validators.required]),
    address: new FormControl(null, [Validators.required]),

  })
  addMember() {
    if (this.memberForm.valid) {
      const value = this.memberForm.value;
      const name = value.firstName.trim() + ' ' + value.lastName.trim();
      console.log(name);
      this.http.put('/member/add_member', { name, address: value.address }).subscribe(data => {
        this.message.success('New member has been created, please check in Member Table!', { nzDuration: 3000 });
        this.memberForm.reset();
      }, err => { this.message.error(err, { nzDuration: 50000, nzPauseOnHover: true }); })
    }
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
