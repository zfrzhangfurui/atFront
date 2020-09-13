import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, ValidatorFn } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NzMessageService } from 'ng-zorro-antd/message';
import { pluck } from 'rxjs/operators';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.less']
})
export class SettingsPage implements OnInit {
  validSecurityCodeForm: FormGroup = this.fb.group({
    oldSecurityCode: new FormControl(null, [Validators.required, Validators.minLength(6)])
  });
  isMatchOldSecurityCode: boolean = false;
  validOldSecurityCodeSubmit() {
    if (this.validSecurityCodeForm.valid) {
      const securityCode = this.validSecurityCodeForm.value.oldSecurityCode;
      this.http.put<{ success: boolean, isMatch: boolean }>('/community/check_security_code', { securityCode }).subscribe(data => {
        if (data.isMatch) {
          this.isMatchOldSecurityCode = true;
          this.message.success(`correct old invite code, please set a new invite code `, { nzDuration: 3000 });
          this.validSecurityCodeForm.reset()
        }
      }, err => {
        this.message.error(`invite code incorrect, please enter an invite code `, { nzDuration: 3000 });
      })
    }
  }
  asd() {
    console.log(this.setNewSecurityCodeForm.controls.matchNewSecurityCode.errors);
  }
  setNewSecurityCodeForm: FormGroup = this.fb.group({
    newSecurityCode: new FormControl(null, [Validators.required, Validators.minLength(6)]),
    matchNewSecurityCode: new FormControl(null, [Validators.required, Validators.minLength(6)]),
  }, { validators: SecurityCodeCompareValidateFn('newSecurityCode', 'matchNewSecurityCode'), updateOn: 'change' });

  submitResetForm() {
    if (this.setNewSecurityCodeForm.invalid) {
      return 0;
    }
    const newSecurityCode = this.setNewSecurityCodeForm.value.newSecurityCode;
    this.http.put<{ success: boolean }>('/community/set_security_code', { securityCode: newSecurityCode }).subscribe(res => {
      if (res.success) {
        this.isMatchOldSecurityCode = false;
        this.message.success(`new invite code setted! `, { nzDuration: 3000 });
        this.setNewSecurityCodeForm.reset()
      }
    }, err => {
      this.message.error(`Error: ${err} `, { nzDuration: 3000 });
    })
  }

  communitySettingForm: FormGroup = this.fb.group({
    contactPerson: new FormControl(null, Validators.required),
    communityEmail: new FormControl(null, Validators.required),
    contactNumber: new FormControl(null, Validators.required),
  })

  communitySettings$ = this.http.get<{
    success: boolean, communitySetting: {
      communityEmail: string,
      contactNumber: string,
      contactPerson: string
    }
  }>('/community/get_community_settings').pipe(pluck('communitySetting')).subscribe(data => {
    this.communitySettingForm.setValue({
      communityEmail: data.communityEmail,
      contactNumber: data.contactNumber,
      contactPerson: data.contactPerson
    })
  })
  submitSettingForm() {
    if (this.communitySettingForm.invalid) {
      return 0;
    }
    const formValue = this.communitySettingForm.value;
    this.http.put('/community/edit_community_settings', {
      communityEmail: formValue.communityEmail,
      contactNumber: formValue.contactNumber,
      contactPerson: formValue.contactPerson
    }).subscribe(_ => {
      this.message.success(`community settings has been updated `, { nzDuration: 3000 });

    })
  }

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private message: NzMessageService
  ) { }

  ngOnInit(): void {
  }

}


export function SecurityCodeCompareValidateFn(securityCode: string, confirmSecurityCode: string): ValidatorFn {
  return (formGroup: FormGroup) => {
    const securityCodeControl = formGroup.get(securityCode);
    const confirmSecurityCodeControl = formGroup.get(confirmSecurityCode);
    console.log(123);
    if (!securityCodeControl || !confirmSecurityCodeControl) {
      return null;
    }

    if (confirmSecurityCodeControl.errors && !confirmSecurityCodeControl.errors.passwordMismatch) {
      return null;
    }

    if (securityCodeControl.value !== confirmSecurityCodeControl.value) {
      confirmSecurityCodeControl.setErrors({ securityCodeMismatch: true });
    } else {
      confirmSecurityCodeControl.setErrors(null);
    }
  }
}