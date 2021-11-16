import { HttpClient } from '@angular/common/http';
import { Component} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { routeTransitionAnimations } from './route-transition-animations';
import { FirestoreService } from './services/firebase/firestore.service';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [routeTransitionAnimations]

})
export class AppComponent{
  title = 'braxel';

  constructor(private firestore: FirestoreService, private http: HttpClient) { }

  ngOnInit() {
  }

  prepareRoute(outlet: RouterOutlet) {
    return outlet && 
      outlet.activatedRouteData && 
      outlet.activatedRouteData['animationState'];
   }


}
