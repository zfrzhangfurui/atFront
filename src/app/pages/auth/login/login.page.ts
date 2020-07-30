import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, RequiredValidator } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { interval } from 'rxjs';

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
  warningMessage: warningMessage = {
    username: null,
    password: null
  };
  form: FormGroup = this.fb.group({
    username: new FormControl(null, [Validators.required]),
    password: new FormControl(null, [Validators.required])
  })

  validate(async: boolean) {
    const controls = this.form.controls;
    for (let i in controls) {
      switch (i) {
        case 'username':
          if (controls[i].errors === null && !async) {
            this.warningMessage[i] = null;
          } else {
            if (async) {
              this.warningMessage[i] = 'Invlid Username or Password ';
            } else {
              if (controls[i].errors.required) {
                this.warningMessage[i] = 'Username is required';
              }
            }
          }
          break;


        case 'password':
          if (controls[i].errors === null && !async) {
            this.warningMessage[i] = null;
          } else {
            if (async) {
              this.warningMessage[i] = 'Invlid Username or Password ';
            } else {
              if (controls[i].errors.required) {
                this.warningMessage[i] = 'Password is required';
              }
            }
          }
          break;
      }
    }
  }

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
    this.validate(false);
    if (this.form.valid && !this.islogin) {
      this.loginAnimation();
      const value = this.form.value;
      this.http.post('/auth/login', {
        email: value.username,
        password: value.password
      }).subscribe(data => {
        setTimeout(() => {
          this.loginAnimation();
          console.log(data);
          this.router.navigate(['../../book'], { relativeTo: this.route })
        }, 2000)

      },
        err => {
          setTimeout(() => {
            this.validate(true);
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
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
  }

}
