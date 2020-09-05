import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { pluck, tap, switchMap, withLatestFrom } from 'rxjs/operators';
import { NzMessageService } from 'ng-zorro-antd/message';
import { MemberHttpResponse } from '../../../../interface/member.interface';
import { BehaviorSubject, Subject } from 'rxjs';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ValidationErrors, ValidatorFn, AbstractControl } from '@angular/forms';
@Component({
  selector: 'app-community',
  templateUrl: './community.page.html',
  styleUrls: ['./community.page.less']
})
export class CommunityPage implements OnInit {
  communityListSubject$: BehaviorSubject<boolean> = new BehaviorSubject(true);
  communityList$ = this.communityListSubject$.pipe(
    switchMap(_ => {
      return this.http.get('/community/admin_get_communities?select=community').pipe(pluck('list'))
    })
  );
  selectCommunity(data) {
    this.community_id = data.community_id;
    this.pageIndex$.next(1);
  }
  /****************************************************/

  addCommunityModalVisible: boolean = false;
  communityName: string;
  securityCode: string;
  repeatSecurityCode: string;
  isCommunityOkLoading: boolean = false;
  showCommunityModal(): void {
    this.addCommunityModalVisible = true;
  }
  addCommunityForm: FormGroup = this.fb.group({
    name: new FormControl(null, [Validators.required]),
    securityCode: new FormControl(null, [Validators.required, Validators.minLength(6)]),
    confirmSecurityCode: new FormControl(null, [Validators.required, Validators.minLength(6)])
  }, { validators: SecurityCodeCompareValidateFn('securityCode', 'confirmSecurityCode'), updateOn: 'blur' })
  communityHandleOk() {
    console.log(123)
    if (this.addCommunityForm.invalid) {
      return 0;
    }
    this.isCommunityOkLoading = true;
    const formValue = this.addCommunityForm.value;
    this.http.post('/community/add_community', { communityName: formValue.name, securityCode: formValue.securityCode }).subscribe(_ => {
      this.addCommunityModalVisible = false;
      this.isCommunityOkLoading = false;
      this.communityListSubject$.next(true);
      this.message.create('success', `add Community ${this.communityName} successfully!`);
    }, err => {
      this.isCommunityOkLoading = false;
      this.message.create('error', `error in adding Community!`);
    })
  }
  handleCancel(): void {
    this.addCommunityModalVisible = false;
  }
  /****************************************************/
  total = 0;
  pageIndex = 1;
  pageSize = 10;
  community_id: string = '';
  pageIndex$: Subject<number> = new Subject();
  memberList$ = this.pageIndex$.pipe(switchMap((pageIndex) => {
    console.log(pageIndex);
    return this.http.get<MemberHttpResponse>(`/member/get_members?pattern=&page=${pageIndex}&limit=${this.pageSize}&community_id=${this.community_id}`)
      .pipe(tap(data => { this.total = data.count }), pluck('list'), tap(_ => { console.log(_) }));
  }))

  onQueryParamsChange(event) {
    const { pageIndex } = event;
    this.pageIndex = pageIndex;
    this.pageIndex$.next(pageIndex);
  }

  changeRole(data) {
    let newRole;
    const pageIndex = this.pageIndex;
    data.user_id.role === 'member' ? newRole = 'admin' : newRole = 'member';
    this.http.put('/user/upgrade_user', { role: newRole, user_id: data.user_id._id }).subscribe(_ => {
      this.pageIndex$.next(pageIndex);
      this.message.create('success', `member id: ${data.m_id}, role of ${data.name} has been changed!`, { nzDuration: 5000 });
    },
      httpErrorRes => {
        this.message.create('error', httpErrorRes.error.message);
      })
  }
  constructor(
    private http: HttpClient,
    private message: NzMessageService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
  }

}






export function SecurityCodeCompareValidateFn(securityCode: string, confirmSecurityCode: string): ValidatorFn {
  return (formGroup: FormGroup) => {
    const securityCodeControl = formGroup.get(securityCode);
    const confirmSecurityCodeControl = formGroup.get(confirmSecurityCode);
    console.log(123);
    if (!securityCodeControl || !confirmSecurityCodeControl) {
      return null;
    }

    if (confirmSecurityCodeControl.errors && !confirmSecurityCodeControl.errors.passwordMismatch) {
      return null;
    }

    if (securityCodeControl.value !== confirmSecurityCodeControl.value) {
      confirmSecurityCodeControl.setErrors({ securityCodeMismatch: true });
    } else {
      confirmSecurityCodeControl.setErrors(null);
    }
  }
}