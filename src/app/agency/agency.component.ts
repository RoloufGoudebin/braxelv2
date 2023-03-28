import { Component, OnInit } from '@angular/core';
import { Meta } from '@angular/platform-browser';


@Component({
  selector: 'app-agency',
  templateUrl: './agency.component.html',
  styleUrls: ['./agency.component.css']
})
export class AgencyComponent implements OnInit {

  constructor(private meta: Meta) { }

  ngOnInit(): void {
    this.meta.updateTag({name:'canonical', content:'https://braxel.be/agence'})
  }

}
