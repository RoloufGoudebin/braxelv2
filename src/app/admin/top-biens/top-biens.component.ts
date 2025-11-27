import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CdkDragDrop, moveItemInArray, CdkDrag } from '@angular/cdk/drag-drop';
import { FirestoreService } from '../../services/firebase/firestore.service';
import { Property } from '../../services/omnicasa/interface';
import { OmnicasaService } from '../../services/omnicasa/omnicasa.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-top-biens',
  templateUrl: './top-biens.component.html',
  styleUrls: ['./top-biens.component.css', '../../view-property-list/view-property-list.component.css']
})
export class TopBiensComponent implements OnInit, OnDestroy {

  @ViewChild('propertyListContainer', { read: ElementRef }) propertyListContainer: ElementRef;

  topPropertyList: Property[];
  propertyList: Property[];
  isSaving = false;
  hasChanges = false;
  placeholderImage = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23ddd" width="400" height="300"/%3E%3Ctext fill="rgba(0,0,0,0.5)" font-family="sans-serif" font-size="30" dy="10.5" font-weight="bold" x="50%25" y="50%25" text-anchor="middle"%3EImage%3C/text%3E%3C/svg%3E';
  
  private subscription: Subscription;
  private scrollInterval: any;
  private isScrolling = false;
  private currentScrollSpeed = 0;
  private scrollDirection = 0; // -1 = gauche, 1 = droite, 0 = stop

  constructor(private firestore: FirestoreService, private omnicasa: OmnicasaService) { }


  ngOnInit(): void {
    // Unsubscribe si déjà souscrit (pour éviter les fuites mémoire)
    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    this.subscription = this.firestore.prout.subscribe(data => {
      const newList = data.map(e => {
        const propertyData = e.payload.doc.data() as Property;
        return {
          id: propertyData.id || 0,
          ...propertyData
        }
      }).filter(e => (e.SubStatus == 2 || e.SubStatus == 3))
      .sort(function (a: Property, b: Property){
        return a.id - b.id;
      });
      
      // Ne mettre à jour que si la liste a réellement changé (éviter la boucle infinie)
      if (!this.topPropertyList || JSON.stringify(newList) !== JSON.stringify(this.topPropertyList)) {
        this.topPropertyList = newList;
        console.log('Biens à la une chargés:', this.topPropertyList.length);
        
        // Vérifier les images (seulement en mode debug)
        if (this.topPropertyList.length > 0 && this.topPropertyList.length < 100) {
          this.topPropertyList.forEach((prop, i) => {
            if (!prop.LargePicture && (!prop.LargePictures || prop.LargePictures.length === 0)) {
              console.warn(`Bien #${i} (${prop.TypeDescription}) n'a pas d'image`);
            }
          });
        }
      }
    });
  }

  ngOnDestroy(): void {
    // Nettoyer la subscription pour éviter les fuites mémoire
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    // Arrêter le scroll
    this.isScrolling = false;
  }

  drop(event: CdkDragDrop<Property[]>) {
    if (event.previousIndex !== event.currentIndex) {
      moveItemInArray(this.topPropertyList, event.previousIndex, event.currentIndex);
      // Mettre à jour les IDs en fonction de la nouvelle position
      this.topPropertyList.forEach((property, index) => {
        property.id = index;
      });
      this.hasChanges = true;
    }
  }

  save() {
    this.isSaving = true;
    this.firestore.savePropertyTop(this.topPropertyList);
    setTimeout(() => {
      this.isSaving = false;
      this.hasChanges = false;
    }, 1000);
  }

  resetOrder() {
    this.topPropertyList.sort((a, b) => a.id - b.id);
    this.hasChanges = false;
  }

  getImageUrl(property: Property): string {
    // Si LargePicture existe et n'est pas vide
    if (property.LargePicture && property.LargePicture.trim() !== '') {
      return property.LargePicture;
    }
    // Si LargePictures existe et contient au moins une image
    if (property.LargePictures && property.LargePictures.length > 0 && property.LargePictures[0]) {
      return property.LargePictures[0];
    }
    // Retourner l'image placeholder
    return this.placeholderImage;
  }

  onImageError(event: any): void {
    // En cas d'erreur de chargement, remplacer par le placeholder
    console.warn('Erreur de chargement d\'image:', event.target.src);
    event.target.src = this.placeholderImage;
  }

  private autoScroll(): void {
    if (!this.isScrolling || !this.propertyListContainer) return;

    const container = this.propertyListContainer.nativeElement;
    container.scrollLeft += this.currentScrollSpeed * this.scrollDirection;

    // Continue le scroll avec requestAnimationFrame (ultra performant!)
    requestAnimationFrame(() => this.autoScroll());
  }

  onDragMoved(event: any): void {
    if (!this.propertyListContainer) return;

    const container = this.propertyListContainer.nativeElement;
    const pointerPosition = event.pointerPosition;
    const containerRect = container.getBoundingClientRect();
    
    // Zone de détection ÉNORME (400px = presque tout l'écran!)
    const edgeSize = 400;
    // Vitesse de base (divisée par 2 = plus confortable)
    const baseScrollSpeed = 25;
    // Accélération maximale (divisée par 2)
    const maxSpeedMultiplier = 2.5;

    // Calculer la distance du curseur par rapport au bord
    const distanceFromRight = containerRect.right - pointerPosition.x;
    const distanceFromLeft = pointerPosition.x - containerRect.left;

    // Scroll à droite
    if (distanceFromRight < edgeSize && distanceFromRight > 0) {
      // Plus on est proche du bord, plus c'est rapide (jusqu'à 5x!)
      const proximity = 1 - (distanceFromRight / edgeSize);
      const speedMultiplier = 1 + (proximity * maxSpeedMultiplier);
      
      this.currentScrollSpeed = baseScrollSpeed * speedMultiplier;
      this.scrollDirection = 1;
      
      if (!this.isScrolling) {
        this.isScrolling = true;
        this.autoScroll();
      }
    }
    // Scroll à gauche
    else if (distanceFromLeft < edgeSize && distanceFromLeft > 0) {
      // Plus on est proche du bord, plus c'est rapide (jusqu'à 5x!)
      const proximity = 1 - (distanceFromLeft / edgeSize);
      const speedMultiplier = 1 + (proximity * maxSpeedMultiplier);
      
      this.currentScrollSpeed = baseScrollSpeed * speedMultiplier;
      this.scrollDirection = -1;
      
      if (!this.isScrolling) {
        this.isScrolling = true;
        this.autoScroll();
      }
    }
    // Pas de scroll
    else {
      this.isScrolling = false;
      this.currentScrollSpeed = 0;
      this.scrollDirection = 0;
    }
  }

  onDragEnded(): void {
    // Arrêter le scroll automatique quand on relâche
    this.isScrolling = false;
    this.currentScrollSpeed = 0;
    this.scrollDirection = 0;
  }

}