import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { AdminPage } from './admin/admin.page';
import { NewBookPage } from './new-book/new-book.page';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzAutocompleteModule } from 'ng-zorro-antd/auto-complete';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzFormModule } from 'ng-zorro-antd/form';
import { CustomComponentModule } from '../../core/components/custom-component.module';
import { DashboardPage } from './dashboard/dashboard.page';
import { MemberPage } from './admin/member/member.page';

@NgModule({
    declarations: [
        AdminPage,
        NewBookPage,
        DashboardPage,
        MemberPage,
    ],
    imports: [
        NzTableModule,
        NzButtonModule,
        NzFormModule,
        CustomComponentModule,
        ReactiveFormsModule,
        CommonModule,
        NzAutocompleteModule,
        NzInputModule,
        RouterModule.forChild(
            [
                { path: '', redirectTo: 'dashboard-page', pathMatch: 'full' },
                { path: 'admin-page', component: AdminPage },
                { path: 'new-book-page', component: NewBookPage },
                { path: 'dashboard-page', component: DashboardPage },

            ]
        )
    ]
})
export class BookModule { }