import { Component, OnInit } from '@angular/core';
import { Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css']
})
export class FaqComponent implements OnInit {

  constructor(private meta : Meta) { }

  ngOnInit(): void {
    this.meta.updateTag({name:'canonical', content:'https://braxel.be/faq'})
  }

}
