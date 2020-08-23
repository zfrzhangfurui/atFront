import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IndexPage } from './pages/index/index.page';
import { AuthPage } from './pages/auth/auth.page';
import { LoginPage } from './pages/auth/login/login.page';
import { SignupPage } from './pages/auth/signup/signup.page';
import { InviteCodePage } from './pages/auth/invite-code/invite-code.page';

const routes: Routes = [
  { path: '', redirectTo: 'index', pathMatch: 'full' },
  { path: 'index', component: IndexPage },
  {
    path: 'auth', component: AuthPage, children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: 'login', component: LoginPage },
      { path: 'signup', component: SignupPage },
      { path: 'invite-code', component: InviteCodePage }
    ]
  },
  { path: 'book', loadChildren: () => import('./pages/book-keep/book.module').then(m => m.BookModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
