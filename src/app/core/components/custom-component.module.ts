import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FzItem } from './fz-item/fz-item';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzFormModule } from 'ng-zorro-antd/form';
@NgModule({
    declarations: [
        // ToastComponent
        FzItem
    ],
    imports: [
        CommonModule,
        NzInputModule,
        NzButtonModule,
        NzTagModule,
        NzDatePickerModule,
        NzFormModule,
        ReactiveFormsModule
    ],
    exports: [
        FzItem
    ]
})
export class CustomComponentModule { }