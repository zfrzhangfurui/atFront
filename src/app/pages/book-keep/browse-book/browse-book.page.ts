import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';

@Component({
  selector: 'app-browse-book',
  templateUrl: './browse-book.page.html',
  styleUrls: ['./browse-book.page.less']
})
export class BrowseBookPage implements OnInit {
  form: FormGroup = this.fb.group({
    name: new FormControl()
  })
  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
  }

}
