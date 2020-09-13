import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { Observable, Observer, of } from 'rxjs';
import { pluck, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.less']
})
export class DashboardPage implements OnInit {
  userInfo$ = this.userService.userInfo$.pipe(pluck('userInfo'));
  userRecord$ = this.http.get
    <
      {
        success: boolean,
        record: [
          {
            _id: { type: boolean },
            c: number,
            g: number,
            p: number,
            transfer: number
          }]
      }
    >
    ('/record/get_dashboard_general_data').pipe(pluck('record'), switchMap(record => {
      let transBalance = 0, cBalance = 0, pBalance = 0, cDeposit, pDeposit, cWithdrow, pWithdrow;
      for (let i of record) {
        if (i._id.type) {
          transBalance = transBalance + i.transfer
          cBalance = cBalance + i.c;
          pBalance = pBalance + i.p;
          cDeposit = i.c;
          pDeposit = i.p;

        } else {
          transBalance = transBalance - i.transfer;
          cBalance = cBalance - i.c;
          pBalance = pBalance - i.p;
          cWithdrow = i.c;
          pWithdrow = i.p;

        }
      }
      return of({ transBalance, cBalance, pBalance, cDeposit, pDeposit, cWithdrow, pWithdrow })
    }))
  constructor(
    private userService: UserService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
  }

}

