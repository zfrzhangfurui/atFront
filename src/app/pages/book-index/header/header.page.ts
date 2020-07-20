import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-header',
  templateUrl: './header.page.html',
  styleUrls: ['./header.page.less']
})
export class HeaderPage implements OnInit {

  nav$ = this.http.get('/user/me').subscribe(data => {
    console.log(data);
  })
  constructor(private http: HttpClient) { }

  ngOnInit(): void {
  }

}
