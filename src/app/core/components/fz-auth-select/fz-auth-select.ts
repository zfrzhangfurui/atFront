import { Component, Input, OnInit, Self, Optional, Renderer2, ViewChild, ElementRef, HostListener } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';

@Component({
    selector: 'fz-auth-select',
    templateUrl: './fz-auth-select.html',
    styleUrls: ['./fz-auth-select.less'],

})

export class FzAuthSelect implements OnInit, ControlValueAccessor {
    selectToggle: boolean = false;
    @Input('selectOptions') data: Array<string>;
    @ViewChild('options') options: ElementRef;
    @ViewChild('bg') bg: ElementRef;
    value: string = 'Find your community';
    onChange: any = () => { };
    onTouched: any = () => { };
    toggle() {
        this.selectToggle = !this.selectToggle;
        if (this.selectToggle) {
            this.renderer.setStyle(this.bg.nativeElement, 'display', 'block');
            this.renderer.setStyle(this.options.nativeElement, 'display', 'block');
        } else {
            this.renderer.setStyle(this.bg.nativeElement, 'display', 'none');
            this.renderer.setStyle(this.options.nativeElement, 'display', 'none');
        }
    }
    clickFn(value) {
        this.value = value;
        console.log(value);
        this.selectToggle = !this.selectToggle;
        this.renderer.setStyle(this.options.nativeElement, 'display', 'none')
        this.renderer.setStyle(this.bg.nativeElement, 'display', 'none');

    }

    @HostListener('document:click', ['$event'])
    clickout(event) {
        if (!this.componentElement.nativeElement.contains(event.target) && this.selectToggle) {
            this.selectToggle = !this.selectToggle;
            this.renderer.setStyle(this.options.nativeElement, 'display', 'none')
            this.renderer.setStyle(this.bg.nativeElement, 'display', 'none');
        }
    }


    registerOnChange(fn: any): void {
        this.onChange = fn;
    }


    writeValue(value): void {
        if (value) {
            this.value = value;
        }
    }

    registerOnTouched(fn) {
        this.onTouched = fn;
    }
    constructor(
        private renderer: Renderer2,
        private componentElement: ElementRef,
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