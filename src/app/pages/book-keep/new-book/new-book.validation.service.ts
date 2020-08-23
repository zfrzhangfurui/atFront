import { Injectable } from "@angular/core";
import { ValidationErrors, ValidatorFn, AbstractControl } from '@angular/forms';
@Injectable()
export class NewBookValidatorService {
    pValidator(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const p = control.get('p').value;
            if (p === null) {
                return null
            } else if (p < 0) {
                return { p: true }
            }
        }
    }

    cValidator(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const c = control.get('c').value;
            if (c === null) {
                return null
            } else if (c < 0) {
                return { c: true }
            }
        }
    }

    gValidator(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const g = control.get('g').value;
            if (g === null) {
                return null
            } else if (g < 0) {
                return { g: true }
            }
        }
    }

    transferValidator(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const transfer = control.get('transfer').value
            if (transfer === null) {
                return { transfer: true }
            } else if (transfer < 0) {
                return { transfer: true }
            } else {
                return null;
            }
        }
    }
    constructor() { }
}

