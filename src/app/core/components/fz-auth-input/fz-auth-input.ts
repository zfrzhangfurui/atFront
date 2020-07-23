import { Component, Input, forwardRef, OnInit, Self, Optional } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';

@Component({
    selector: 'fz-auth-input',
    templateUrl: './fz-auth-input.html',
    styleUrls: ['./fz-auth-input.less'],

})

export class FzAuthInput implements OnInit, ControlValueAccessor {
    usernameValidState: string = 'default';
    inputFocusToggle: boolean = false;
    @Input('title') title = '';
    @Input() disabled: boolean;
    message: string;
    @Input('warnMessage')
    set warnMessage(value: string) {
        if (value === 'default') {
            this.usernameValidState = 'default';
            this.message = this.title;
        } else {
            this.usernameValidState = 'warningMessage';
            this.message = value;
        }
    };
    setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    onChange: any = () => { };
    onTouched: any = () => { };

    value: string;




    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    getValue(value) {
        this.value = value;
    }

    writeValue(value): void {
        this.unFocusFn();
        if (value) {
            this.value = value;
        }


    }



    registerOnTouched(fn) {
        this.onTouched = fn;
    }
    focusFn() {
        this.inputFocusToggle = true;
    }
    unFocusFn() {
        if (this.value !== '' && this.value !== null) {
            this.inputFocusToggle = true;
        } else {
            this.inputFocusToggle = false;
        }
    }

    constructor(
        @Self()
        @Optional()
        private ngControl: NgControl
    ) {
        if (this.ngControl) {
            this.ngControl.valueAccessor = this;
        }
    }

    ngOnInit() {
    }



}