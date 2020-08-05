import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { Observable, Observer } from 'rxjs';
import { pluck } from 'rxjs/operators';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.less']
})
export class DashboardPage implements OnInit {
  role$ = this.userService.user$.pipe(pluck('userInfo', 'role'));
  constructor(private userService: UserService) { }

  ngOnInit(): void {
  }

}
