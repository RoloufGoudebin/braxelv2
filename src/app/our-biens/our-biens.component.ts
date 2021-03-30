import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-our-biens',
  templateUrl: './our-biens.component.html',
  styleUrls: ['./our-biens.component.css']
})
export class OurBiensComponent implements OnInit {

  constructor() { }
  numberProperty= 8;

  ngOnInit(): void {
    
  }

  addProperties(){
    this.numberProperty = this.numberProperty+8;
  }

}
