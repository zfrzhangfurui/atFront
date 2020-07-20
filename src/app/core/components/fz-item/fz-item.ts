import { Component, Input } from '@angular/core';
import { ControlContainer } from '@angular/forms';
@Component({
    selector: 'fz-item',
    templateUrl: './fz-item.html',
    styleUrls: ['./fz-item.less']
})
export class FzItem {
    @Input('data') data: string;
    constructor(
        public controlContainer: ControlContainer
    ) { }
}
