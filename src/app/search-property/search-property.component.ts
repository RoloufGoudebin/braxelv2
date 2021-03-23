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

  sliderRadius: SliderDetails =
    {
      minValue: 0,
      highValue: 100,
      options: {
        floor: 0,
        ceil: 100,
        step: 1,
      }
    }

  sliderRooms: SliderDetails =
    {
      minValue: 0,
      highValue: 10,
      options: {
        floor: 0,
        ceil: 10,
        step: 1
      }
    }

  sliderBudget: SliderDetails =
    {
      minValue: 0,
      highValue: 2000000,
      options: {
        floor: 0,
        ceil: 2000000,
        step: 10000,
        translate: (value: number): string => {
          return value + " €";
        }
      }
    }

}
