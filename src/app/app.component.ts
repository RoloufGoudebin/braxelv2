import { Component, Input } from '@angular/core';
import { OmnicasaService } from './services/omnicasa/omnicasa.service';
import { Property } from './services/omnicasa/interface';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent{
  title = 'braxel';

  constructor(public omnicasa: OmnicasaService) { }


  propertyList: Property[]; // liste des propriétés


  ngOnInit() {
  }


}
