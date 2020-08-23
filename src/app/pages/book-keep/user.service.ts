import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { shareReplay, switchMap } from 'rxjs/operators';
import { BookModule } from './book.module';
import { BehaviorSubject } from 'rxjs';

export interface User {
    success: boolean,
    userInfo: {
        email: string,
        role: string
    }
}
@Injectable()
export class UserService {

    getUserInfo: BehaviorSubject<boolean> = new BehaviorSubject(true);

    user$ = this.getUserInfo.pipe(switchMap(() => {
        return this.http.get<User>('/user/me')
    }))
    userInfo$ = this.user$.pipe(shareReplay())
    constructor(private http: HttpClient) {
        this.userInfo$.subscribe(data => {
            // console.log(data);
        })
    }
} 