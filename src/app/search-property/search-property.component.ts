import { Component, OnInit } from '@angular/core';

import { Options } from "@angular-slider/ngx-slider";

interface SliderDetails {
  minValue: number;
  highValue: number;
  options: Options;
}

@Component({
  selector: 'app-search-property',
  templateUrl: './search-property.component.html',
  styleUrls: ['./search-property.component.css']
})
export class SearchPropertyComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  items = [
    {name:'Acheter', active:false},
    {name:'Louer', active:false}
  ];

  toggleClass(item){
    this.items[0].active = false;
    this.items[1].active = false;
    this.items[2].active = false;
    item.active = "active";
  }

  sliderRadius: SliderDetails =
    {
      minValue: 0,
      highValue: 100,
      options: {
        floor: 0,
        ceil: 100,
        step: 5,
      }
    }

  sliderRooms: SliderDetails =
    {
      minValue: 0,
      highValue: 10,
      options: {
        floor: 0,
        ceil: 10,
        step: 1,
      }
    }

  sliderBudget: SliderDetails =
    {
      minValue: 0,
      highValue: 2000000,
      options: {
        floor: 0,
        ceil: 5000000,
        step: 10000,
        translate: (value: number): string => {
          return value + " €";
        }
      }
    }

}
