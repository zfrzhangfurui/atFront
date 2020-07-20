import {
  Component,
  OnInit,
  HostListener,
  ViewChild,
  ElementRef,
} from '@angular/core';

@Component({
  selector: 'app-index',
  templateUrl: './index.page.html',
  styleUrls: ['./index.page.less']
})
export class IndexPage implements OnInit {
  @ViewChild("vision") vision: ElementRef;
  onScrolling: boolean = false;
  @HostListener("document:scroll") scrollfunction() {
    if (this.vision.nativeElement.getBoundingClientRect().top < 30) {
      this.onScrolling = true;
    } else {
      this.onScrolling = false;
    }
  }
  scrollTo(element) {
    let gap = element.getBoundingClientRect().top;

    window.scrollBy({ top: gap, behavior: "smooth" });
  }
  constructor() { }
  ngOnInit(): void {
  }

}
