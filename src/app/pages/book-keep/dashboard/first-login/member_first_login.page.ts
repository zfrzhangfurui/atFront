import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { debounceTime, distinctUntilChanged, switchMap, pluck } from 'rxjs/operators';
import { UserService } from '../../user.service';
import { of, combineLatest, BehaviorSubject, merge } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd/message';
interface ItemData {
  name: string;
  age: number;
  address: string;
}
interface HttpResponeList extends ItemData {
  success: boolean,
  list: [ItemData]
}
@Component({
  selector: 'app-member-first-login',
  templateUrl: './member_first_login.page.html',
  styleUrls: ['./member_first_login.page.less']
})
export class MemberFirstLoginPage implements OnInit {
  listOfData: ItemData[] = [];
  form = this.fb.group({
    firstName: new FormControl(null, [Validators.required]),
    lastName: new FormControl(null, [Validators.required]),
    address: new FormControl(null, [Validators.required]),
  });
  // talbe$ = debounceTime(),distinctUntilChanged()
  search = this.fb.group({
    value: null
  })
  filterValue: string = '';
  memberFilter(value) {
    this.memberFilter$.next(value);
  }
  memberFilter$: BehaviorSubject<string> = new BehaviorSubject(this.filterValue)
  table$ = this.memberFilter$.pipe(
    debounceTime(500),
    distinctUntilChanged(),
    switchMap(val => {
      return this.http.get<HttpResponeList>(`/member/first_login_get_members?pattern=${val}`);
    }), pluck('list')
  )
  linkToMember(member) {

    this.http.put('/member/user_link_to_member', { member_id: member._id }).subscribe(
      data => {
        this.message.create('success', 'link to member successfully!')
        setTimeout(() => {
          this.userService.getUserInfo.next(true);
        }, 2000);
      }
    ), err => {
      console.log(err);
    };
  }

  submitForm() {
    if (this.form.valid) {
      const value = this.form.value;
      const name = value.firstName.trim() + ' ' + value.lastName.trim();
      this.http.post('/member/user_become_member_without_name', { name, address: value.address }).subscribe(data => {

        this.message.create('success', 'Update your member profile successfully!,redirect in a second!');
        setTimeout(() => {
          this.userService.getUserInfo.next(true);
        }, 2000)

      }, err => {
        this.message.create('error', `${err}`);
      })
    }
  }

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private userService: UserService,
    private message: NzMessageService
  ) { }

  ngOnInit(): void {

  }
}


