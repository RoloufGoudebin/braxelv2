import { Component, Input } from '@angular/core';
import { OmnicasaService } from './services/omnicasa/omnicasa.service';
import { Property } from './services/omnicasa/interface';
import { RouterOutlet } from '@angular/router';
import { routeTransitionAnimations } from './route-transition-animations';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [routeTransitionAnimations]

})
export class AppComponent{
  title = 'braxel';

  constructor(public omnicasa: OmnicasaService) { }


  propertyList: Property[]; // liste des propriétés


  ngOnInit() {
  }

  prepareRoute(outlet: RouterOutlet) {
    return outlet && 
      outlet.activatedRouteData && 
      outlet.activatedRouteData['animationState'];
   }


}
