import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IndexPage } from './pages/index/index.page';
import { AuthPage } from './pages/auth/auth.page';
import { BookIndexPage } from './pages/book-index/book-index.page';
const routes: Routes = [
  { path: '', redirectTo: 'book', pathMatch: 'full' },
  { path: 'index', component: IndexPage },
  { path: 'auth', component: AuthPage },
  { path: 'book', component: BookIndexPage, loadChildren: () => import('./pages/book-keep/book.module').then(m => m.BookModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
