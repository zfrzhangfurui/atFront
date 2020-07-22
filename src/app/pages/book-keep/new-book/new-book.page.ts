import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray } from '@angular/forms';
import { BehaviorSubject, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { TransactionStatus, Transaction } from '../../../interface/new-book.interface';
@Component({
  selector: 'app-new-book',
  templateUrl: './new-book.page.html',
  styleUrls: ['./new-book.page.less']
})
export class NewBookPage implements OnInit {
  form: FormGroup = this.fb.group({
    formArray: this.fb.array([])
  });
  formArray: FormArray;
  data: Array<Transaction> = [
    {
      name: 'qwe',
      type: true,
      entryStamp: '1',
      createdAt: '2020/02/02',
      status: TransactionStatus.OLD,
      transfer: 123,
      p: 1,
      c: 2,
      g: 3,
    },
    {
      name: 'qwe',
      type: true,
      entryStamp: '2',
      createdAt: '2020/02/02',
      status: TransactionStatus.OLD,
      transfer: 123,
      p: 1,
      c: 2,
      g: 3,
    },
    {
      name: 'qwe',
      type: true,
      entryStamp: '3',
      createdAt: '2020/02/02',
      status: TransactionStatus.OLD,
      transfer: 123,
      p: 1,
      c: 2,
      g: 3,
    }
  ]
  config: BehaviorSubject<string> = new BehaviorSubject('init');
  result$ = this.config.pipe(switchMap(config => {
    let data = this.data;
    if (config === 'init') {
      this.formArray = <FormArray>this.form.get('formArray');
      this.formArray.clear();
      data.sort(function (a, b) {
        return +b.entryStamp - +a.entryStamp
      })

      for (let item of data) {
        this.formArray.push(this.createItem(item))
      }
      console.log(this.formArray);
    }
    return of(data)
  }))

  createItem(item) {
    return this.fb.group({
      name: new FormControl(item.name),
      type: true,
      entryStamp: new FormControl(item.entryStamp),
      createdAt: new FormControl(item.createdAt),
      transfer: new FormControl(item.transfer),
      p: new FormControl(item.p),
      c: new FormControl(item.c),
      g: new FormControl(item.g),
      status: new FormControl(item.status)
    })
  }
  createNewItem() {
    const item: Transaction = {
      name: null,
      type: true,
      entryStamp: null,
      createdAt: null,
      status: TransactionStatus.NEW,
      transfer: null,
      p: null,
      c: null,
      g: null,
    }
    return this.createItem(item);
  }
  addTransaction() {
    this.createNewItem();
    this.formArray.insert(0, this.createNewItem());
    console.log(this.formArray);
  }
  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.result$.subscribe();
  }

  submit() {
  }

}
