import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from 'src/environments/environment';
import { CoreModule } from './core/core.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzModalModule } from 'ng-zorro-antd/modal';
/********************************************/
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import {
  faCoffee,
  faUser,
  faKey,
  faChevronDown,
  faChevronUp,
  faHouseUser,
  faHandHoldingHeart
} from '@fortawesome/free-solid-svg-icons';
import { CustomComponentModule } from './core/components/custom-component.module';
import { IndexPage } from './pages/index/index.page';
import { AuthPage } from './pages/auth/auth.page';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NZ_I18N, en_US } from 'ng-zorro-antd/i18n';
import zh from '@angular/common/locales/zh';

import { LoginPage } from './pages/auth/login/login.page';
import { SignupPage } from './pages/auth/signup/signup.page';
import { InviteCodePage } from './pages/auth/invite-code/invite-code.page';
import { UserService } from './pages/book-keep/user.service';
registerLocaleData(zh);
@NgModule({
  declarations: [
    AppComponent,
    IndexPage,
    AuthPage,
    LoginPage,
    SignupPage,
    InviteCodePage
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    NzInputModule,
    NzIconModule,
    FontAwesomeModule,
    NzSelectModule,
    CustomComponentModule,
    NzMessageModule,
    NzModalModule,
    NzFormModule,
    CoreModule.forRoot({
      api_gateway: environment.api_gateway,
      base_url: environment.baseUrl
    }),
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
  ],
  providers: [{ provide: NZ_I18N, useValue: en_US }, UserService],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(faCoffee, faUser, faKey, faChevronDown, faChevronUp, faHouseUser, faHandHoldingHeart);
  }
}
