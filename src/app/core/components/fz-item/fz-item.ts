import { Component, Input, OnInit, Output, ComponentRef } from '@angular/core';
import { ControlContainer, FormGroup, FormControlName } from '@angular/forms';
import { Transaction, TransactionStatus } from '../../../interface/new-book.interface';
import { MemberHttpResponse } from '../../../interface/member.interface';
import { HttpClient } from '@angular/common/http';
import { pluck } from 'rxjs/operators';
import { pipe } from 'rxjs';
@Component({
    selector: 'fz-item',
    templateUrl: './fz-item.html',
    styleUrls: ['./fz-item.less']
})
export class FzItem implements OnInit {
    @Input('index') index: string;
    @Input('userTrySubmit') userTrySubmit: boolean;

    public form: FormGroup;
    iconColor: string;


    onAssessTransLogic(field) {
        this.transactionLogic(field);
    }

    transactionLogic(field) {
        let value: Transaction = this.form.value;
        if (value.type) {
            switch (field) {
                case "transfer": {
                    const rest = value.transfer - value.g;
                    const p = Math.round(rest * 0.7);
                    const c = rest - p;
                    this.form.patchValue({
                        p: p,
                        c: c
                    })
                    break;
                }

                case "p": {
                    const c = value.transfer - value.g - value.p;
                    this.form.patchValue({
                        c: c
                    })
                    break;
                }

                case "c": {
                    const p = value.transfer - value.g - value.c;
                    this.form.patchValue({
                        p: p
                    })
                    break;
                }

                case "g": {
                    const rest = value.transfer - value.g;
                    const p = Math.round(rest * 0.7);
                    const c = rest - p;
                    this.form.patchValue({
                        p: p,
                        c: c
                    })
                    break;
                }
            }
        } else {
            if (field === 'p' || field === 'c' || field === 'g') {
                const total = (+value.c) + (+value.p) + (+value.g);
                this.form.patchValue({
                    transfer: total
                })
            }
        }
    }




    changeType() {
        let value: Transaction = this.form.value;
        this.form.patchValue({
            type: !value.type
        })
        this.form.markAllAsTouched();
        console.log(this.form);
        this.setForm();
    }


    setForm() {
        if (this.form.value.type) {
            this.form.controls.transfer.enable();
            this.form.controls.p.disable();
            this.form.controls.c.disable();
        } else {
            this.form.controls.p.enable();
            this.form.controls.c.enable();
            this.form.controls.transfer.disable();
        }

        const setIcon = () => {
            if (this.form.value.type) {
                this.iconColor = 'green';
            } else {
                this.iconColor = 'red';
            }
        }

        setIcon();
    }

    enableToggle: boolean = false;
    enable() {
        this.enableToggle = !this.enableToggle;
        if (this.enableToggle) {
            if (this.form.value.type) {
                this.form.controls.p.enable();
                this.form.controls.c.enable();
            }
        } else {
            if (this.form.value.type) {
                this.form.controls.p.disable();
                this.form.controls.c.disable();
            }
        }

    }

    removeComponentToggle: boolean = false;
    remove() {
        this.form.patchValue({
            status: TransactionStatus.ONDELETE
        });
        this.http.delete(`/transactions/delete_single/${this.form.value.trans_id}`).subscribe(data => {
            console.log(data);
            this.removeComponentToggle = true;
        },
            err => {
                console.log(err);
            })
    }

    listOfOption: Array<{ value: string; text: string }> = [];
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
    selectValueChange() {
        const value = this.form.controls.member_id.value;
        if (value !== null) {
            this.http.get<MemberHttpResponse>(`/member/select_get_member?member_id=${this.form.controls.member_id.value}`).pipe(pluck('list')).subscribe(data => {

                this.form.controls.name.setValue(data[0].name);
                // console.log(this.form.controls.name);
            })
        } else {
            this.form.controls.name.setValue(null);
        }
        this.form.markAllAsTouched();
    }
    initSearchValue() {
        console.log(this.form.controls.member_id);
        console.log(this.form.controls.member_id.value);
        const listOfOption: Array<{ value: any; text: any }> = [];
        if (this.form.controls.member_id.value !== null && this.form.controls.member_id.value !== '') {
            this.http.get<MemberHttpResponse>(`/member/select_get_member?member_id=${this.form.controls.member_id.value}`).pipe(pluck('list')).subscribe(data => {
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
    }
    constructor(
        public controlContainer: ControlContainer,
        private http: HttpClient
    ) { }

    ngOnInit(): void {
        this.form = <FormGroup>this.controlContainer.control;
        this.setForm();
        this.initSearchValue();
    }
}
