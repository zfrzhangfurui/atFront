import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { pluck, tap, switchMap } from 'rxjs/operators';
import { BehaviorSubject, Subject, of } from 'rxjs';
import * as moment from 'moment';
import { MemberHttpResponse } from 'src/app/interface/member.interface';
import { saveAs } from 'file-saver';
import { NzMessageService } from 'ng-zorro-antd/message';
@Component({
  selector: 'app-browse-book',
  templateUrl: './browse-book.page.html',
  styleUrls: ['./browse-book.page.less']
})
export class BrowseBookPage implements OnInit {
  /*********************select***************************************************/
  selectMemberId: string = null;
  listOfOption: Array<{ value: string; text: string }> = [];;
  search(value: string) {
    console.log(value);
    this.http.get<MemberHttpResponse>(`/member/get_members?pattern=${value}&page=1&limit=10`).pipe(pluck('list')).subscribe(data => {
      const listOfOption: Array<{ value: any; text: any }> = [];
      data.forEach(item => {
        listOfOption.push({
          // value: item._id,
          // text: `${item.name} | ${item.m_id}`
          value: item._id,
          text: `${item.name}    | member id:${item.m_id}`
        })
      })

      this.listOfOption = listOfOption;
    })
  }
  radio = 'y';
  startTime: Date = null;
  endTime: Date = null;
  finicialYear: Date = new Date();
  sortTime: boolean = true;
  sortAlphabet: boolean = false;
  modelChange() {
    this.pageIndex = 1;
    this.pageIndex$.next(1);
  }
  /****************************table*****************************************************/
  total: number = 0;
  pageIndex: number = 1;
  pageSize: number = 10;
  pageIndex$: Subject<number> = new Subject();
  table$ = this.pageIndex$.pipe(switchMap(pageIndex => {
    let startTime: string, endTime: string, member_id: string;
    if (this.radio === 'y') {
      this.startTime === null ? startTime = '' : startTime = moment(this.startTime).format('YYYY-MM-DD');
      this.endTime === null ? endTime = '' : endTime = moment(this.endTime).add(1, 'd').format('YYYY-MM-DD');
    } else if (this.radio === 'f') {

      const time = moment(this.finicialYear).format('YYYY');
      startTime = `${time}-07-01`;
      endTime = `${+time + 1}-07-01`;
    }
    this.selectMemberId === null ? member_id = '' : member_id = this.selectMemberId;
    return this.http.get<{ success: boolean, count: number, list: [] }>(`/record/get_records?page=${pageIndex}&limit=10&starttime=${startTime}&endtime=${endTime}&sorttime=${this.sortTime}&sortalphabet=${this.sortAlphabet}&member_id=${member_id}&status=active`).pipe(tap(data => {
      this.total = data.count;
      console.log(data.list);
    }), pluck('list'))
  }))





  onQueryParamsChange(event) {
    const { pageIndex } = event;
    this.pageIndex = pageIndex;
    this.pageIndex$.next(pageIndex);
  }

  reset() {
    this.radio = 'y';
    this.startTime = null;
    this.endTime = null;
    this.finicialYear = new Date();
    this.sortTime = true;
    this.sortAlphabet = false;
    this.selectMemberId = null;
    this.pageIndex = 1;
    this.pageIndex$.next(1);
  }


  download() {
    if (this.selectMemberId === null) {
      this.message.error(`Must pick a member to download member's excel!`, { nzDuration: 3000 });
      return 0;
    }
    let startTime: string, endTime: string, member_id: string = this.selectMemberId;
    if (this.radio === 'y') {
      this.startTime === null ? startTime = '' : startTime = moment(this.startTime).format('YYYY-MM-DD');
      this.endTime === null ? endTime = '' : endTime = moment(this.endTime).add(1, 'd').format('YYYY-MM-DD');
    } else if (this.radio === 'f') {

      const time = moment(this.finicialYear).format('YYYY');
      startTime = `${time}-07-01`;
      endTime = `${+time + 1}-07-01`;
    }
    this.http.get(`/record/download_xlsx?startTime=${startTime}&endTime=${endTime}&member_id=${member_id}`, { observe: 'response', responseType: 'blob' }).subscribe(data => {
      var blob = new Blob([data.body], { type: data.body.type });
      var filename = 'file.xlsx';
      saveAs(blob, filename);
      console.log(data.body);
    });
  }
  onDeleteRecord(record) {
    console.log(123);
    const delete_id = record._id;
    const pageIndex = this.pageIndex;
    const m_id = record.member_id.m_id
    const name = record.name;
    this.http.delete(`/record/delete_record?delete_id=${delete_id}`).subscribe(_ => {
      this.pageIndex$.next(pageIndex);
      this.message.success(`Member id : ${m_id}, name: ${name}, Transaction has been deleted!`, { nzDuration: 3000 });
    }, err => {
      this.message.error(`Errors occured on deleting Transactions!`, { nzDuration: 3000 });

    })
  }

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private message: NzMessageService
  ) { }

  ngOnInit(): void {
  }

}
