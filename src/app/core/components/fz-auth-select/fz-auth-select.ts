import { Component, Input, OnInit, Self, Optional, Renderer2, ViewChild, ElementRef } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';

@Component({
    selector: 'fz-auth-select',
    templateUrl: './fz-auth-select.html',
    styleUrls: ['./fz-auth-select.less'],

})

export class FzAuthSelect implements OnInit {
    selectToggle: boolean = false;
    @ViewChild('options') options: ElementRef;
    toggle() {
        this.selectToggle = !this.selectToggle;
    }
    data: Array<string> = ['Hobart', 'Launceston', 'Hobart', 'Launceston']

    clickFn() {
        this.renderer.setStyle(this.options.nativeElement, 'display', 'none')
    }
    constructor(
        private renderer: Renderer2
    ) { }

    ngOnInit() {
    }



}