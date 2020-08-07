import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from 'src/environments/environment';
import { CoreModule } from './core/core.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSelectModule } from 'ng-zorro-antd/select';
/********************************************/
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import {
  faCoffee,
  faUser,
  faKey,
  faChevronDown,
  faChevronUp,
  faHouseUser
} from '@fortawesome/free-solid-svg-icons';
import { CustomComponentModule } from './core/components/custom-component.module';
import { IndexPage } from './pages/index/index.page';
import { AuthPage } from './pages/auth/auth.page';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NZ_I18N, en_US } from 'ng-zorro-antd/i18n';
import zh from '@angular/common/locales/zh';

import { LoginPage } from './pages/auth/login/login.page';
import { SignupPage } from './pages/auth/signup/signup.page';
registerLocaleData(zh);
@NgModule({
  declarations: [
    AppComponent,
    IndexPage,
    AuthPage,
    LoginPage,
    SignupPage
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
    CoreModule.forRoot({
      api_gateway: environment.api_gateway
    }),
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
  ],
  providers: [{ provide: NZ_I18N, useValue: en_US }],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(faCoffee, faUser, faKey, faChevronDown, faChevronUp, faHouseUser);
  }
}
