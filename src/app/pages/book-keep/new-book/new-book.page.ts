import { Component, OnInit, ViewChild, ElementRef, Renderer2, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { BehaviorSubject, of, interval, forkJoin, combineLatest, Observable } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';
import { TransactionStatus, Transaction, TransHttpResponse } from '../../../interface/new-book.interface';
import { HttpClient } from '@angular/common/http';
import { NewBookValidatorService } from './new-book.validation.service';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';
@Component({
  selector: 'app-new-book',
  templateUrl: './new-book.page.html',
  styleUrls: ['./new-book.page.less'],
  animations: [
    trigger('saveStateTrigger', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('200ms ease', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        animate('1.5s ease', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class NewBookPage implements OnInit, OnDestroy {
  userTrySubmit: boolean = false;
  pValidator = this.validationService.pValidator;
  cValidator = this.validationService.cValidator;
  gValidator = this.validationService.gValidator;
  transferValidator = this.validationService.transferValidator;
  onPolling: boolean = false;
  savePrompt: string = 'Saved !';
  formSeq: number = 0;
  form: FormGroup = this.fb.group({
    formArray: this.fb.array([])
  });
  formArray: FormArray = <FormArray>this.form.get('formArray');;
  config: BehaviorSubject<string> = new BehaviorSubject('init');
  transactions$ = this.http.get<TransHttpResponse>('/transactions/get_transactions').pipe(switchMap(httpRes => {
    const transactions: Array<Transaction> = httpRes.list;
    console.log(transactions);
    this.formArray.clear();
    transactions.sort(function (a, b) {
      return +b.seq - +a.seq
    })
    // console.log(transactions);
    for (let item of transactions) {
      item.status = TransactionStatus.OLD;
      this.formArray.push(this.createItem(item))
    }
    // console.log(this.formArray);
    if (httpRes.count === 0) {
      this.formArray.push(this.createNewItem())
    }
    return of();
  })).subscribe()

  createItem(item) {
    let i = this.fb.group({
      name: new FormControl(item.name),
      member_id: new FormControl(item.member_id, [Validators.required]),
      trans_id: new FormControl(item.trans_id, [Validators.required]),
      formSeq: this.formSeq,
      seq: item.seq,
      type: new FormControl(item.type),
      entryTime: new FormControl(item.entryTime),
      createdAt: new FormControl(item.createdAt, [Validators.required]),
      transfer: new FormControl(item.transfer),
      p: new FormControl(item.p),
      c: new FormControl(item.c),
      g: new FormControl(item.g),
      status: new FormControl(item.status)
    }, { validator: [this.transferValidator(), this.pValidator(), this.cValidator(), this.gValidator()] })
    this.formSeq = this.formSeq + 1;
    return i;
  }
  createNewItem() {
    const item: Transaction = {
      name: null,
      member_id: null,
      trans_id: null,
      formSeq: null,
      seq: null,
      entryTime: null,
      type: true,
      createdAt: null,
      status: TransactionStatus.NEW,
      transfer: null,
      p: null,
      c: null,
      g: null,
    }
    return this.createItem(item);
  }
  addNewTransaction() {
    this.formArray.insert(0, this.createNewItem());
    // console.log(this.formArray);
  }


  Polling = interval(5000).pipe(switchMap(_ => {
    this.onPolling = true;
    this.savePrompt = 'Saving ...';

    const form: FormGroup[] = <FormGroup[]>this.formArray.controls;
    // console.log(this.formArray);
    let arrOnCreate: Array<Transaction> = [];
    let arrFormSeq: Array<number> = [];
    let arrOnUpdate: Array<Transaction> = [];
    for (let item of form) {
      //Create
      if (item.value.status === TransactionStatus.NEW) {
        arrOnCreate.unshift({ ...item.value });
        arrFormSeq.unshift(item.value.formSeq);
      } else if (item.touched === true && item.value.status === TransactionStatus.OLD) { //update
        console.log(item);
        arrOnUpdate.push(item.getRawValue());
      }
    }
    // console.log('ArrOnCreate', arrOnCreate);
    // console.log('ArrFormSeq', arrFormSeq);
    const createFn = () => {
      return this.http.post<TransHttpResponse>('/transactions/batch_create', arrOnCreate);
    }
    const updateFn = () => {
      return this.http.put('/transactions/batch_update', arrOnUpdate);
    }

    return forkJoin(createFn(), updateFn(), of(arrFormSeq));
  })).subscribe(
    ([resCreate, resUpdate, arrFormSeq]: [TransHttpResponse, TransHttpResponse, Array<number>]) => {
      setTimeout(() => {
        this.savePrompt = 'Saved !';
      }, 500)
      setTimeout(() => {
        this.onPolling = false;
      }, 1200)
      if (resCreate.count !== 0) {
        // console.log(resCreate.list);
        for (let [i, j] of resCreate.list.entries()) {
          for (let q of this.formArray.controls) {
            if (q.value.formSeq === arrFormSeq[i] && q.value.status === TransactionStatus.NEW) {
              q.patchValue({
                entryTime: j.entryTime,
                seq: j.seq,
                trans_id: j.trans_id,
                status: TransactionStatus.OLD
              })
            } else if (q.value.formSeq === arrFormSeq[i] && q.value.status !== TransactionStatus.NEW) {
              console.error(`Error in create new Transaction, the value status of ${q} is not NEW`);
            }
          }
        }
      }

      if (resUpdate.success) {
        console.log('update successfully!');
        if (resUpdate.count > 0) {
          this.formArray.markAsUntouched();
        }
        // console.log(resUpdate.count);
      }
    }
  );



  submit() {
    console.log(this.formArray);
    for (let i = this.formArray.controls.length - 1; i >= 0; i -= 1) {
      const controlGroup: FormGroup = <FormGroup>this.formArray.controls[i];
      const stateControl: FormControl = <FormControl>controlGroup.controls.status;
      if (stateControl.value === TransactionStatus.ONDELETE) {
        this.formArray.removeAt(i);
      }
    }
    let count = 0;
    this.formArray.controls.forEach((controlGroup: FormGroup, index) => {
      for (let i in controlGroup.errors) {
        if (controlGroup.errors.hasOwnProperty(i)) {
          ++count;
        }
      }
      for (let i in controlGroup.controls) {
        if (controlGroup.get(i).invalid) {
          ++count
        }
      }
    })
    this.errorCount = count;
    this.isVisible = true;
  }

  /********modal************/
  isVisible = false;
  isConfirmLoading = false;
  errorCount: number;
  handleOk(): void {
    this.isConfirmLoading = true;

    if (this.formArray.valid) {
      this.http.post('/record/batch_create', this.formArray.getRawValue()).
        pipe(switchMap(() => {
          return this.http.delete('/transactions/batch_delete')
        })).subscribe(data => {
          this.isVisible = false;
          this.userTrySubmit = false;
          this.isConfirmLoading = false;
          this.formArray.clear();
          this.addNewTransaction()
        },
          err => {
            console.log(err)
          })
    }
  }

  handleCancel(): void {
    this.userTrySubmit = true;
    this.isVisible = false;
  }

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private render: Renderer2,
    private validationService: NewBookValidatorService
  ) { }

  ngOnInit(): void {
  }
  ngOnDestroy(): void {
    this.Polling.unsubscribe();
  }


}
