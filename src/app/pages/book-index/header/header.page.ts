import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { pluck } from 'rxjs/operators';
import { UserService } from '../../book-keep/user.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.page.html',
  styleUrls: ['./header.page.less']
})
export class HeaderPage implements OnInit {

  user$ = this.userService.userInfo$.pipe(pluck('userInfo'))
  logOut() {
    this.http.get('/auth/logout').subscribe(_ => {
      this.router.navigate(['/index'])
    })
  }
  constructor(
    private userService: UserService,
    private http: HttpClient,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

}
