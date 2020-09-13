import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AdminPage } from './admin/admin.page';
import { NewBookPage } from './new-book/new-book.page';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzAutocompleteModule } from 'ng-zorro-antd/auto-complete';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { NzTimelineModule } from 'ng-zorro-antd/timeline';
import { CustomComponentModule } from '../../core/components/custom-component.module';
import { BookIndexPage } from '../book-index/book-index.page';
import { HeaderPage } from '../book-index/header/header.page';
import { DashboardPage } from './dashboard/dashboard.page';
import { MemberFirstLoginPage } from './dashboard/first-login/member_first_login.page';
import { MemberPage } from './admin/member/member.page';
import { UserService } from './user.service';
import { NewBookValidatorService } from './new-book/new-book.validation.service';
import { BrowseBookPage } from './browse-book/browse-book.page';
import { CommunityPage } from './admin/community/community.page';
import { SettingsPage } from './admin/settings/settings.page';
import { AuthGuard } from '../../core/guards/auth.guard';
@NgModule({
    declarations: [
        AdminPage,
        NewBookPage,
        DashboardPage,
        MemberFirstLoginPage,
        BookIndexPage,
        HeaderPage,
        MemberPage,
        BrowseBookPage,
        CommunityPage,
        SettingsPage,
    ],
    imports: [
        NzTableModule,
        NzButtonModule,
        NzFormModule,
        CustomComponentModule,
        ReactiveFormsModule,
        FormsModule,
        CommonModule,
        NzAutocompleteModule,
        NzInputModule,
        NzLayoutModule,
        NzMenuModule,
        NzPopconfirmModule,
        NzTabsModule,
        NzAvatarModule,
        NzMessageModule,
        NzSelectModule,
        NzModalModule,
        NzRadioModule,
        NzDatePickerModule,
        NzSwitchModule,
        NzListModule,
        NzStatisticModule,
        NzTimelineModule,
        RouterModule.forChild(
            [
                {
                    path: '', component: BookIndexPage, children: [
                        { path: '', redirectTo: 'dashboard-page', pathMatch: 'full', canActivate: [AuthGuard] },
                        { path: 'admin-page', component: AdminPage, canActivate: [AuthGuard] },
                        { path: 'new-book-page', component: NewBookPage, canActivate: [AuthGuard] },
                        { path: 'dashboard-page', component: DashboardPage, canActivate: [AuthGuard] },
                        { path: 'browse-book-page', component: BrowseBookPage, canActivate: [AuthGuard] },
                    ], canActivate: [AuthGuard]
                }
            ]
        )
    ],
    providers: [UserService, NewBookValidatorService, AuthGuard]
})
export class BookModule { }