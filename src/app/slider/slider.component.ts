import { Component, Input, OnInit } from '@angular/core';

import { Options } from '@angular-slider/ngx-slider';


interface SliderDetails {
  minValue: number;
  highValue: number;
  options : Options;
}

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss']
})
export class SliderComponent{

  @Input() options: SliderDetails;



}
