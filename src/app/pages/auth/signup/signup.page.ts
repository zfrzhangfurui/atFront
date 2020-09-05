import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl, AsyncValidatorFn, ValidatorFn } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
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
    inviteCode: new FormControl(null, [Validators.required, Validators.minLength(6)]),
    email: new FormControl(null, [Validators.required, Validators.email], existingEmailValidator(this.http)),
    password: new FormControl(null, [Validators.required, Validators.minLength(6)]),
    repeatPassword: new FormControl(null, [Validators.required])
  }, { validators: PasswordCompareValidate('password', 'repeatPassword') })
  vaildationResult = {
    email: null,
    password: null,
    repeatPassword: null
  }
  signup() {
    const community = this.form.controls.community;
    const emailForm = this.form.controls.email;
    const password = this.form.controls.password;
    const inviteCode = this.form.controls.inviteCode;
    console.log(this.form);

    if (this.form.valid) {
      this.http.post('/auth/register', { community_id: community.value, email: emailForm.value, password: password.value, securityCode: inviteCode.value }).subscribe(data => {
        this.message.create('success', `creating your account!, redirect to Book page in a second!`);
        setTimeout(() => {
          this.router.navigate(['../../book'], { relativeTo: this.route });
        }, 3000)
      })
    } else {
      this.form.markAllAsTouched();
    }
  }

  backToLogin() {
    this.router.navigate(['../login'], { relativeTo: this.route });
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





export function PasswordCompareValidate(password: string, confirmPassword: string): ValidatorFn {
  return (formGroup: FormGroup) => {
    const passwordControl = formGroup.get(password);
    const confirmPasswordControl = formGroup.get(confirmPassword);
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