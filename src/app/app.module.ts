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
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
/********************************************/
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faCoffee, faUser, faKey } from '@fortawesome/free-solid-svg-icons';
import { IndexPage } from './pages/index/index.page';
import { AuthPage } from './pages/auth/auth.page';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { zh_CN } from 'ng-zorro-antd/i18n';
import zh from '@angular/common/locales/zh';
import { BookIndexPage } from './pages/book-index/book-index.page';
import { HeaderPage } from './pages/book-index/header/header.page';
registerLocaleData(zh);
@NgModule({
  declarations: [
    AppComponent,
    IndexPage,
    AuthPage,
    BookIndexPage,
    HeaderPage
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    NzInputModule,
    NzIconModule,
    NzMenuModule,
    FontAwesomeModule,
    NzLayoutModule,
    CoreModule.forRoot({
      api_gateway: environment.api_gateway
    }),
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
  ],
  providers: [{ provide: NZ_I18N, useValue: zh_CN }],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(faCoffee, faUser, faKey);
  }
}
