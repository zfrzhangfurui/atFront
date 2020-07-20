import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.less']
})
export class AuthPage implements OnInit {
  inputFocusToggle: Array<boolean> = [false, false];

  focusFn(event) {
    const form = this.form.value;
    if (
      event === 'user' &&
      form.username === ''
    ) {
      this.inputFocusToggle[0] = !this.inputFocusToggle[0];
    } else if (
      event === 'password' &&
      form.password === ''
    ) {
      console.log(123)
      this.inputFocusToggle[1] = !this.inputFocusToggle[1];
    }
  }

  form: FormGroup = this.fb.group({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])
  })


  usernameValidState = 'default';
  passwordValidState = 'default';

  showWarnMessage(fromBackend: boolean) {
    if (fromBackend) {

    } else {
      console.log(this.form.controls);
      const controls = this.form.controls;
      for (let control in controls) {
        if (!controls[control].valid) {
          switch (control) {
            case 'username': this.usernameValidState = 'noValue'; break;
            case 'password': this.passwordValidState = 'noValue'; break;
          }
        } else if (controls[control].valid) {
          switch (control) {
            case 'username': this.usernameValidState = 'default'; break;
            case 'password': this.passwordValidState = 'default'; break;
          }
        }
      }
    }
  }

  login() {
    this.showWarnMessage(false);
    console.log(this.usernameValidState + '  ' + this.passwordValidState);
    console.log(this.form.value);
    if (this.form.valid) {
      console.log(123);
      this.http.post('/auth/login', {
        email: this.form.value.username,
        password: this.form.value.password
      }).subscribe(data => {
        this.router.navigate(['../book/'])
      })
    }
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
