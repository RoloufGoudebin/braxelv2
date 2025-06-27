import { ViewportScroller } from '@angular/common';
import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { FirestoreService } from '../services/firebase/firestore.service';
import { Property } from '../services/omnicasa/interface';
import { PropertySearchService } from '../services/property-search.service';
import { SharedDatasService } from '../services/shared-datas.service';

@Component({
  selector: 'app-our-biens',
  templateUrl: './our-biens.component.html',
  styleUrls: ['./our-biens.component.css']
})

export class OurBiensComponent implements OnInit, OnDestroy {

  @ViewChild('addMore') addMore: ElementRef;

  allProperties: Property[] = [];
  toShow: Property[] = [];
  
  private subscriptions: Subscription[] = [];

  constructor(
    public firestore: FirestoreService, 
    private viewportScroller: ViewportScroller, 
    private translate: TranslateService, 
    public sharedDatas: SharedDatasService, 
    private meta: Meta,
    private searchService: PropertySearchService
  ) { }

  ngOnInit(): void {
    this.meta.updateTag({ name: 'canonical', content: 'https://braxel.be/nos-biens' });
    this.sharedDatas.resetPropertiesOurBiens();

    // Subscribe to properties from Firestore
    const propertiesSub = this.firestore.prout.subscribe(data => {
      this.allProperties = data.map(e => {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data() as Property
        }
      }).sort(function (a: Property, b: Property) {
        return a.id - b.id;
      }).sort(function (a: Property, b: Property) {
        if (a.SubStatus == 2 || a.SubStatus == 3) {
          if (b.SubStatus == 2 || b.SubStatus == 3) {
            return 0;
          }
          else {
            return -1;
          }
        }
        else {
          if (b.SubStatus == 2 || b.SubStatus == 3) {
            return 1;
          }
          else {
            return 0;
          }
        }
      });

      // Pass properties to search service
      this.searchService.setAllProperties(this.allProperties);
      
      // Initialize toShow with all properties if no search criteria
      const currentCriteria = this.searchService.getCurrentCriteria();
      if (!currentCriteria) {
        this.toShow = this.allProperties;
      }
    });

    // Subscribe to search results
    const searchSub = this.searchService.searchResults$.subscribe(results => {
      const currentCriteria = this.searchService.getCurrentCriteria();
      if (currentCriteria) {
        // If there are search criteria, show results (even if empty)
        if (JSON.stringify(this.toShow) !== JSON.stringify(results)) {
          this.toShow = results;
        }
      } else {
        // If no search criteria, show all properties
        if (JSON.stringify(this.toShow) !== JSON.stringify(this.allProperties)) {
          this.toShow = this.allProperties;
        }
      }
    });

    this.subscriptions.push(propertiesSub, searchSub);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  public scrollTo(elementId: string): void {
    this.viewportScroller.scrollToAnchor(elementId);
  }

  @HostListener('document:scroll', ['$event'])
  onScroll(event: Event) {
    const windowHeight = window.innerHeight;
    const boundingAddMore = this.addMore.nativeElement.getBoundingClientRect();

    if (boundingAddMore.top <= windowHeight) {
      this.sharedDatas.addPropertiesOurBiens();
    }
  }

  lowerThan(one: number, two: number) {
    return one < two;
  }
}
