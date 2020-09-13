import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { UserService } from '../../pages/book-keep/user.service';
@Injectable({ providedIn: 'root' })

export class AuthGuard implements CanActivate {
    constructor(
        private userService: UserService,
        private router: Router,
        private http: HttpClient
    ) {

    }
    canActivate(route: ActivatedRouteSnapshot, router: RouterStateSnapshot): Observable<boolean> {

        return this.userService.userInfo$.pipe(map(user => {
            console.log(user);
            if (!!user) {
                return !!user
            }
        }), catchError(err => {
            this.router.navigate(['/auth/login']);
            return of(false)
        }))
    }
}