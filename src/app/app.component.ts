import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import{ Router, NavigationEnd, RouterOutlet} from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { routeTransitionAnimations } from './route-transition-animations';
import { FirestoreService } from './services/firebase/firestore.service';



declare let gtag: Function;


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [routeTransitionAnimations]

})
export class AppComponent {
  title = 'braxel';
  date;

  constructor(private firestore: FirestoreService, private http: HttpClient, private translate: TranslateService, private router: Router) {
    var lg = navigator.language;
    translate.setDefaultLang('fr');
    translate.use(lg[0] + lg[1]);
    translate.addLangs(['en', 'fr', 'nl']);
  }

  ngOnInit() {
    //this.firestore.updatePropertyListActive();
    //this.firestore.updatePropertyListSell()
    //this.firestore.createPropertyListSell();
    //this.firestore.createPropertyListActive();
    this.firestore.setPropertyListActiveFire();
    this.firestore.getDateRefresh().subscribe(data =>
      this.date = data.map(e => {
        return {
          ...e.payload.doc.data() as any
        }
      }));
    setTimeout(() => {
      if (Date.now() - this.date[0].lastRefresh > 3600000) {
        this.firestore.updatePropertyListActive();
      }
    },
      3000);
  }

  setUpAnalytics() {
    this.router.events
      .subscribe((event: NavigationEnd) => {
        gtag('config', 'G-GNFNNFB0QP',
          {
            page_path: event.urlAfterRedirects
          }
        );
      });
  }

  prepareRoute(outlet: RouterOutlet) {
    return outlet &&
      outlet.activatedRouteData &&
      outlet.activatedRouteData['animationState'];
  }


  getRefresh = () =>
    this.firestore
      .getDateRefresh()
      .subscribe(data =>
        this.date = data.map(e => {
          return {
            ...e.payload.doc.data() as any
          }
        }));;



}
