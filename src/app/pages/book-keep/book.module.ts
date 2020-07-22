import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { AdminPage } from './admin/admin.page';
import { NewBookPage } from './new-book/new-book.page';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { CustomComponentModule } from '../../core/components/custom-component.module';
@NgModule({
    declarations: [
        AdminPage,
        NewBookPage,
    ],
    imports: [
        NzButtonModule,
        CustomComponentModule,
        ReactiveFormsModule,
        CommonModule,
        RouterModule.forChild(
            [
                { path: '', redirectTo: 'new-book-page', pathMatch: 'full' },
                { path: 'admin-page', component: AdminPage },
                { path: 'new-book-page', component: NewBookPage },
            ]
        )
    ]
})
export class BookModule { }