import { Component, OnInit } from '@angular/core';

import { Options } from '@angular-slider/ngx-slider';

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss']
})
export class SliderComponent{

  constructor() { }

  minChambre: number = 0;
  maxChambre: number = 10;
  options: Options = {
    floor: 0,
    ceil: 10
  };

}
