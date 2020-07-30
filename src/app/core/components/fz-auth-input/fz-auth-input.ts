import { Component, Input, forwardRef, OnInit, Self, Optional, Output } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { EventEmitter } from '@angular/core';

@Component({
    selector: 'fz-auth-input',
    templateUrl: './fz-auth-input.html',
    styleUrls: ['./fz-auth-input.less'],

})

export class FzAuthInput implements OnInit, ControlValueAccessor {
    usernameValidState: string = 'default';
    inputFocusToggle: boolean = false;
    iconType: Array<string>;
    @Output()
    focusOut: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Input('icon')
    set icon(value: string) {
        switch (value) {
            case 'username': this.iconType = ['fas', 'user']; break;
            case 'password': this.iconType = ['fas', 'key']; break;
        }
    }
    @Input('title') title = '';
    @Input() disabled: boolean;
    @Input('type') type: string = 'text';
    message: string;
    @Input('warnMessage')
    set warnMessage(value: string) {
        if (value === null || value === undefined) {
            this.usernameValidState = 'default';
            this.message = this.title;
        } else {
            if (value === 'This email is avaiable!') {
                this.usernameValidState = 'avaiableEmail';
                this.message = value;
            } else {
                this.usernameValidState = 'warningMessage';
                this.message = value;
            }

        }
    };
    setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    onChange: any = () => { };
    onTouched: any = () => { };

    value: string = null;




    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    getValue(value) {
        this.value = value;
    }

    writeValue(value): void {

        if (value) {
            this.value = value;
            this.unFocusFn();
        }
    }

    registerOnTouched(fn) {
        this.onTouched = fn;
    }
    focusFn() {
        this.focusOut.emit(false);
        this.inputFocusToggle = true;
    }
    unFocusFn() {
        this.focusOut.emit(true);
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