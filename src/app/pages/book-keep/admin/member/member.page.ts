import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
interface ItemData {
  name: string;
  age: number;
  address: string;
}
@Component({
  selector: 'app-member',
  templateUrl: './member.page.html',
  styleUrls: ['./member.page.less']
})
export class MemberPage implements OnInit {
  listOfData: ItemData[] = [];
  form;
  submitForm() { }
  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    const data = [];
    for (let i = 0; i < 100; i++) {
      data.push({
        name: `Edward King ${i}`,
        age: 32,
        address: `London, Park Lane no. ${i}`
      });
    }
    this.listOfData = data;


    this.form = this.fb.group({

      fieldA: [null, [Validators.required]],
      filedB: [null, [Validators.required]]
    });
  }
}


