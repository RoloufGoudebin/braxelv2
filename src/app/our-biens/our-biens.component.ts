import { ViewportScroller } from '@angular/common';
import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
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
  isFallbackMode: boolean = false;
  /** True après la première réponse Firestore — évite le message "Aucune propriété" au premier paint (Soft 404). */
  hasDataLoaded: boolean = false;

  private subscriptions: Subscription[] = [];

  constructor(
    public firestore: FirestoreService,
    private viewportScroller: ViewportScroller,
    private translate: TranslateService,
    public sharedDatas: SharedDatasService,
    private meta: Meta,
    private title: Title,
    private searchService: PropertySearchService
  ) { }

  ngOnInit(): void {
    this.title.setTitle('Biens immobiliers à vendre et louer | Waterloo, Brabant wallon - Braxel');
    this.meta.updateTag({ name: 'description', content: 'Découvrez notre sélection de biens immobiliers à vendre et à louer à Waterloo et dans le Brabant wallon. Maisons, appartements et terrains.' });
    this.meta.updateTag({ name: 'canonical', content: 'https://braxel.be/nos-biens' });
    this.sharedDatas.resetPropertiesOurBiens();

    // Abonnement aux propriétés depuis Firestore
    const propertiesSub = this.firestore.activeProperties$.subscribe(data => {
      this.allProperties = data.map(e => {
        const propertyData = e.payload.doc.data() as Property;
        return {
          id: propertyData.id || 0,
          ...propertyData
        }
      }).sort((a: Property, b: Property) => {
        // Tri principal par disponibilité (SubStatus 2,3 = disponibles en premier)
        const aAvailable = a.SubStatus === 2 || a.SubStatus === 3;
        const bAvailable = b.SubStatus === 2 || b.SubStatus === 3;
        
        if (aAvailable && !bAvailable) return -1;
        if (!aAvailable && bAvailable) return 1;
        
        // Tri secondaire par position (id)
        return a.id - b.id;
      });

      // Transmission des propriétés au service de recherche
      this.searchService.setAllProperties(this.allProperties);
      
      // Application des critères par défaut si aucun critère n'existe
      const currentCriteria = this.searchService.getCurrentCriteria();
      if (!currentCriteria) {
        const defaultCriteria = {
          goal: 0, // 0 = Achat, 1 = Location
          location: '',
          propertyTypes: [],
          zipCodes: [],
          selectedRooms: [],
          minPrice: null,
          maxPrice: null,
          showWithTerrace: false,
          showWithGarden: false,
          minSurface: null,
          maxSurface: null,
          subTypes: [],
          propertyConditions: [],
          minGardenSurface: null,
          maxGardenSurface: null,
          minGarageCount: null
        };
        
        this.searchService.updateSearchCriteria(defaultCriteria);
      }
      this.hasDataLoaded = true;
    });

    // Abonnement aux résultats de recherche
    const searchSub = this.searchService.searchResults$.subscribe(results => {
      const currentCriteria = this.searchService.getCurrentCriteria();
      if (currentCriteria) {
        // Affichage des résultats de recherche (même si vide)
        if (JSON.stringify(this.toShow) !== JSON.stringify(results)) {
          this.toShow = results;
        }
      } else {
        // Aucun critère : affichage de toutes les propriétés
        if (JSON.stringify(this.toShow) !== JSON.stringify(this.allProperties)) {
          this.toShow = this.allProperties;
        }
      }
    });

    // Abonnement au mode fallback
    const fallbackSub = this.searchService.isFallbackMode$.subscribe(isFallback => {
      this.isFallbackMode = isFallback;
    });

    this.subscriptions.push(propertiesSub, searchSub, fallbackSub);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  public scrollTo(elementId: string): void {
    this.viewportScroller.scrollToAnchor(elementId);
  }

  @HostListener('document:scroll', ['$event'])
  onScroll(event: Event): void {
    if (!this.addMore?.nativeElement) return;
    const windowHeight = window.innerHeight;
    const boundingAddMore = this.addMore.nativeElement.getBoundingClientRect();

    if (boundingAddMore.top <= windowHeight) {
      this.sharedDatas.addPropertiesOurBiens();
    }
  }

  lowerThan(one: number, two: number): boolean {
    return one < two;
  }
}
