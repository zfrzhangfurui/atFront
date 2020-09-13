import { HttpClient } from '@angular/common/http';
import {
  Component,
  OnInit,
  HostListener,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { pluck } from 'rxjs/operators';

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

  communityTable$ = this.http.get('/community/get_communities').pipe(pluck('list'))

  contactPerson: string = null;
  communityEmail: string = null;
  isVisible: boolean = false;

  showModal(community) {
    this.contactPerson = community.contactPerson;
    this.communityEmail = community.communityEmail;
    this.isVisible = true;
  }


  emailForm: FormGroup = this.fb.group({
    title: new FormControl(null, Validators.required),
    email: new FormControl(null, [Validators.email, Validators.required]),
    content: new FormControl(null, Validators.required)
  })
  handleOk() {
    console.log(this.emailForm);
    if (this.emailForm.invalid) {
      this.emailForm.updateValueAndValidity();
      return;
    }
    const emailForm = this.emailForm.value;
    const communityEmail = this.communityEmail;
    this.message.warning(`sending... please wait for response! `, { nzDuration: 3000 });
    this.http.post('/email/send_email', { title: emailForm.title, sendTo: communityEmail, email: emailForm.email, content: emailForm.content }).subscribe(_ => {
      this.message.success(`Email  sent! `, { nzDuration: 3000 });
      this.isVisible = false;
    }, err => {
      this.message.error(`something wrong with server! `, { nzDuration: 3000 });

    })
  }
  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private message: NzMessageService
  ) { }
  ngOnInit(): void {
    this.communityTable$.subscribe(data => {
      console.log(data);
    })
  }

}
