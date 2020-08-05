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
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { CustomComponentModule } from '../../core/components/custom-component.module';
import { BookIndexPage } from '../book-index/book-index.page';
import { HeaderPage } from '../book-index/header/header.page';
import { DashboardPage } from './dashboard/dashboard.page';
import { MemberFirstLoginPage } from './admin/member/member_first_login.page';
import { UserService } from './user.service';
@NgModule({
    declarations: [
        AdminPage,
        NewBookPage,
        DashboardPage,
        MemberFirstLoginPage,
        BookIndexPage,
        HeaderPage
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
        NzLayoutModule,
        NzMenuModule,
        RouterModule.forChild(
            [
                {
                    path: '', component: BookIndexPage, children: [
                        { path: '', redirectTo: 'dashboard-page', pathMatch: 'full' },
                        { path: 'admin-page', component: AdminPage },
                        { path: 'new-book-page', component: NewBookPage },
                        { path: 'dashboard-page', component: DashboardPage },
                    ]
                }
            ]
        )
    ],
    providers: [UserService]
})
export class BookModule { }