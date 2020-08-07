import { Component, OnInit, Injectable } from '@angular/core';
import { UserService } from '../../book-keep/user.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.page.html',
  styleUrls: ['./header.page.less']
})
export class HeaderPage implements OnInit {

  user$ = this.userService.userInfo$.subscribe(data => {
    console.log(data);
  })
  constructor(private userService: UserService) { }

  ngOnInit(): void {
  }

}
