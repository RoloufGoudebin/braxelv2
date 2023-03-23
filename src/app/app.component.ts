import { HttpClient } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { routeTransitionAnimations } from './route-transition-animations';
import { FirestoreService } from './services/firebase/firestore.service';
import { DOCUMENT } from '@angular/common';



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
  lg;

  constructor(private firestore: FirestoreService, private translate: TranslateService, private router: Router, @Inject(DOCUMENT) private document: Document) {
  }

  ngOnInit() {
    this.lg = navigator.language;
    this.translate.setDefaultLang('fr');
    this.translate.use(this.lg[0] + this.lg[1]);
    this.translate.addLangs(['en', 'fr', 'nl']);
    if (this.lg == 'en' || this.lg == 'fr' || this.lg == 'nl') {
      this.document.documentElement.lang = this.lg;
    }
    else {
      this.document.documentElement.lang = 'fr';
    }
    this.firestore.updatePropertyListActive();
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
