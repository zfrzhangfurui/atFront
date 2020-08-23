import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl, AsyncValidatorFn, ValidatorFn } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { pluck, debounceTime, take, switchMap, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.less']
})
export class SignupPage implements OnInit {
  value$: Observable<[{ community: string, id: string }]> = this.http.get('/community/get_communities').pipe(pluck('list'))

  form: FormGroup = this.fb.group({
    community: new FormControl(null, [Validators.required]),
    email: new FormControl(null, [Validators.required, Validators.email], existingEmailValidator(this.http)),
    password: new FormControl(null, [Validators.required, Validators.minLength(6)]),
    repeatPassword: new FormControl(null, [Validators.required])
  }, { validators: PasswordCompareValidateFn('password', 'repeatPassword') })
  vaildationResult = {
    email: null,
    password: null,
    repeatPassword: null
  }
  signup() {

    console.log(this.form);
    return
    const community = this.form.controls.community;
    const emailForm = this.form.controls.email;
    const password = this.form.controls.password;
    const repeatPassword = this.form.controls.repeatPassword;
    // this.checkEmail(true);



    this.checkEmail();
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
  checkEmail() {
    const emailForm = this.form.controls.email;
    if (emailForm.valid) {
      return 0;
    }
    if (emailForm.hasError('required')) {
      this.vaildationResult.email = 'Email is required!';
    } else if (emailForm.hasError('email')) {
      this.vaildationResult.email = 'this field must filled with Email!'
    } else if (emailForm.hasError('EmailUseByOthers'))
      this.vaildationResult.email = 'this This email has been used by others!'

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



export function existingEmailValidator(http: HttpClient): AsyncValidatorFn {
  return (control: FormControl): Observable<{ [key: string]: any } | null> => {
    console.log(control);
    if (control.value === null) {
      return of(null)
    } else {
      return of(control.value).pipe(debounceTime(500), take(1), switchMap(_ => {
        return http.get<{ success, isEmailAvailable }>(`/auth/validate_email/${control.value}`)
      }), pluck('isEmailAvailable'), switchMap(isEmailAvailable => {
        if (isEmailAvailable) {
          return of(null)
        } else {
          return of({ EmailUseByOthers: true })
        }
      }), tap(_ => {
        control.parent.updateValueAndValidity({ onlySelf: false, emitEvent: true })
      })
      )
    }
  }
}





export function PasswordCompareValidateFn(password: string, confirmPassword: string): ValidatorFn {
  return (formGroup: FormGroup) => {
    const passwordControl = formGroup.get(password);
    const confirmPasswordControl = formGroup.get(confirmPassword);
    console.log(123);
    if (!passwordControl || !confirmPasswordControl) {
      return null;
    }

    if (confirmPasswordControl.errors && !confirmPasswordControl.errors.passwordMismatch) {
      return null;
    }

    if (passwordControl.value !== confirmPasswordControl.value) {
      confirmPasswordControl.setErrors({ passwordMismatch: true });
    } else {
      confirmPasswordControl.setErrors(null);
    }
  }
}