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
    email: new FormControl(null, [Validators.email]),
    password: new FormControl(null)
  })
  vaildationResult = {
    email: null,
    password: null,
    repeatPassword: null
  }
  signup() {
    this.http.post('/auth/register', {})
  }


  emailFocusOutToggle: boolean;
  checkEmail(event) {
    const emailForm = this.form.controls.email;
    if (event) {
      if (emailForm.valid) {
        if (emailForm.value !== null && emailForm.value !== '') {
          this.http.get<{ success, isUserExsits }>(`/auth/validate_email/${emailForm.value}`).subscribe(data => {
            if (!data.isUserExsits) {
              this.vaildationResult.email = 'This email is avaiable!';
            } else {
              this.vaildationResult.email = 'email is already exists!';
            }
          })
        } else {
          this.vaildationResult.email = null;
        }
      } else {
        this.vaildationResult.email = 'this field has to filled with email!';
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
