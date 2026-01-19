import { Component, OnInit } from '@angular/core';
import { Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-code-deontologie',
  templateUrl: './code-deontologie.component.html',
  styleUrls: ['./code-deontologie.component.css']
})
export class CodeDeontologieComponent implements OnInit {

  constructor(private meta: Meta) { }

  ngOnInit(): void {
    this.meta.updateTag({name:'canonical', content:'https://braxel.be/code-deontologie'})
  }

}
