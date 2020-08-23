import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FzItem } from './fz-item/fz-item';
import { FzAuthInput } from './fz-auth-input/fz-auth-input';
import { FzAuthSelect } from './fz-auth-select/fz-auth-select';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
    declarations: [
        // ToastComponent
        FzItem,
        FzAuthInput,
        FzAuthSelect
    ],
    imports: [
        CommonModule,
        NzInputModule,
        NzButtonModule,
        NzTagModule,
        NzDatePickerModule,
        NzFormModule,
        NzSelectModule,
        FontAwesomeModule,
        ReactiveFormsModule
    ],
    exports: [
        FzItem,
        FzAuthInput,
        FzAuthSelect
    ]
})
export class CustomComponentModule {

    constructor() {

    }
}