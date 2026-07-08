import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FirestoreService } from '../services/firebase/firestore.service';
import { Property } from '../services/omnicasa/interface';
import { BraxelHome } from '../braxel-home.model';
import { Meta } from '@angular/platform-browser';

/**
 * Composant de la page d'accueil
 * Affiche les biens à la une dans l'ordre défini dans l'admin
 */
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  numberProperty = 9;
  texts: BraxelHome[];
  showChiffres = false;
  toShow: Property[];
  isSSR = false;
  private propertiesSubscription: Subscription;

  constructor(
    private firestore: FirestoreService,
    private meta: Meta
  ) {}

  ngOnInit(): void {
    this.loadTopProperties();
    this.setupMetaTags();
    this.detectSSR();
  }

  /**
   * Charge les biens à la une depuis Firestore
   * Les biens sont triés par leur champ 'id' pour respecter l'ordre défini dans l'admin
   */
  private loadTopProperties(): void {
    this.propertiesSubscription = this.firestore.activeProperties$.subscribe(data => {
      const newToShow = data
        .map(e => {
          const propertyData = e.payload.doc.data() as Property;
          return {
            id: this.normalizeId(propertyData.id),
            ...propertyData
          };
        })
        .filter(e => e.SubStatus === 2 || e.SubStatus === 3)
        .sort((a, b) => a.id - b.id);

      if (JSON.stringify(this.toShow) !== JSON.stringify(newToShow)) {
        this.toShow = newToShow;
      }
    });
  }

  ngOnDestroy(): void {
    this.propertiesSubscription?.unsubscribe();
  }

  /**
   * Normalise un ID (remplace les valeurs invalides par 999999 pour les placer à la fin)
   */
  private normalizeId(id: any): number {
    return (id !== undefined && id !== null && typeof id === 'number' && id >= 0) ? id : 999999;
  }

  /**
   * Configure les meta tags pour le SEO
   */
  private setupMetaTags(): void {
    this.meta.updateTag({ name: 'canonical', content: 'https://braxel.be/' });
  }

  /**
   * Détecte si on est en mode SSR (Server Side Rendering)
   */
  private detectSSR(): void {
    this.isSSR = typeof window === 'undefined';
  }

}
