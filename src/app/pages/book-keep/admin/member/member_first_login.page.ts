import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { debounceTime, distinctUntilChanged, switchMap, pluck } from 'rxjs/operators';
import { UserService } from '../../user.service';
import { of, combineLatest, BehaviorSubject, merge } from 'rxjs';
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
    firstName: null,
    lastName: null,
    address: null
  });
  // talbe$ = debounceTime(),distinctUntilChanged()
  search = this.fb.group({
    value: null
  })

  initTable: BehaviorSubject<boolean> = new BehaviorSubject(true)
  table$ = merge(this.initTable, this.search.valueChanges).pipe(
    debounceTime(500),
    distinctUntilChanged(),
    switchMap(val => {
      if (val === true) {
        return this.http.get<HttpResponeList>('/community/get_members');
      } else {
        console.log(val);
        return this.http.get<HttpResponeList>(`/community/get_members?pattern=${val.value}`);
      }

    }), pluck('list')
  )
  linkToMember(member) {
    console.log(member);
    this.http.put('/community/user_link_to_member', { member_id: member.member_id }).subscribe(
      data => {
        console.log(data);
        this.userService.getUserInfo.next(true);
      }
    ), err => {
      console.log(err);
    };
  }

  submitForm() { }
  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private userService: UserService
  ) { }

  ngOnInit(): void {

  }
}


