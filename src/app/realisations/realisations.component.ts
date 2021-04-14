import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-realisations',
  templateUrl: './realisations.component.html',
  styleUrls: ['./realisations.component.css']
})
export class RealisationsComponent implements OnInit {

  constructor() { }
  numberProperty=12;

  ngOnInit(): void {
  }

  addProperties(){
    this.numberProperty = this.numberProperty+8;
  }

}
