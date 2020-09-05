import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, RequiredValidator } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { interval } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd/message';


export interface warningMessage {
  username: string,
  password: string,
}

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.less']
})
export class LoginPage implements OnInit {

  form: FormGroup = this.fb.group({
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [Validators.required, Validators.minLength(6)])
  })


  islogin: boolean = false;
  loginTitle: string = 'login';
  interval;

  loginAnimation() {
    this.islogin = !this.islogin;
    if (this.islogin) {
      this.interval = setInterval(() => {
        switch (this.loginTitle) {
          case 'login': this.loginTitle = 'loging in .'; break;
          case 'loging in .': this.loginTitle = 'loging in ..'; break;
          case 'loging in ..': this.loginTitle = 'loging in ...'; break;
          case 'loging in ...': this.loginTitle = 'loging in .'; break;
        }
      }, 500)
    } else {
      console.log('clear');
      clearInterval(this.interval);
      this.loginTitle = 'login';
    }

  }
  login() {
    if (this.form.valid && !this.islogin) {
      this.loginAnimation();
      const value = this.form.value;
      this.http.post('/auth/login', {
        email: value.email,
        password: value.password
      }).subscribe(data => {
        this.message.create('success', `Logingin!, redirect your page in a second!`);
        setTimeout(() => {
          this.loginAnimation();
          console.log(data);
          this.router.navigate(['../../book'], { relativeTo: this.route })
        }, 2000)

      },
        err => {
          this.message.create('error', `Invalid Email or Password!`, { nzDuration: 10000 });
          setTimeout(() => {
            this.loginAnimation();
            console.log(err);
          }, 2000)

        })
    }
  }

  signup() {
    this.router.navigate(['../signup'], { relativeTo: this.route });
  }
  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private message: NzMessageService
  ) { }

  ngOnInit(): void {
  }

}
