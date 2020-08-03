import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.less']
})
export class SignupPage implements OnInit {
  value: Array<string> = ['hobart', 'launceston',]
  form: FormGroup = this.fb.group({
    community: new FormControl(null, [Validators.required]),
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [Validators.required, Validators.minLength(6)]),
    repeatPassword: new FormControl(null, [Validators.required])
  })
  vaildationResult = {
    email: null,
    password: null,
    repeatPassword: null
  }
  signup() {
    const community = this.form.controls.community;
    const emailForm = this.form.controls.email;
    const password = this.form.controls.password;
    const repeatPassword = this.form.controls.repeatPassword;
    // this.checkEmail(true);
    console.log(this.form.valid);


    this.checkEmail(true);
    if (this.form.valid) {
      if (password.value === repeatPassword.value) {
        this.vaildationResult.repeatPassword = null;
        this.vaildationResult.password = null
        if (this.avaiableEmail) {
          this.http.post('/auth/register', { community: community.value, email: emailForm.value, password: password.value }).subscribe(data => {
            console.log(data);
          })
        }

      } else {
        this.vaildationResult.repeatPassword = 'not identical to password';
      }
    } else {
      if (password.errors !== null) {
        console.log(password.errors);
        console.log(password.hasOwnProperty('errors'));
        if (password.errors.hasOwnProperty('minlength')) {
          this.vaildationResult.password = 'at least 6 letters';
        }
        if (password.errors.hasOwnProperty('required')) {
          this.vaildationResult.password = 'This field is requied';
        }
      } else {
        this.vaildationResult.password = null;
      }
    }

  }

  avaiableEmail: boolean = false;
  emailFocusOutToggle: boolean;
  checkEmail(event) {
    const emailForm = this.form.controls.email;
    if (event) {
      if (emailForm.valid) {
        this.http.get<{ success, isUserExsits }>(`/auth/validate_email/${emailForm.value}`).subscribe(data => {
          if (!data.isUserExsits) {
            this.avaiableEmail = true;
            this.vaildationResult.email = 'This email is avaiable!';
          } else {
            this.avaiableEmail = false;
            this.vaildationResult.email = 'email is already exists!';
          }
        })
      } else {
        this.avaiableEmail = false;
        if (emailForm.value === null || emailForm.value === '') {
          this.vaildationResult.email = 'this field is required!';
        } else {
          this.vaildationResult.email = 'this field has to filled with email!';
        }
      }
    }
  }
  backToLogin() {
    this.router.navigate(['../login'], { relativeTo: this.route });
  }
  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) { }


  ngOnInit(): void {
  }
  asd() {
    console.log(this.form);
  }


}
