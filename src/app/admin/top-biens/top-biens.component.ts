import { Component, OnInit, OnDestroy } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { FirestoreService } from '../../services/firebase/firestore.service';
import { Property } from '../../services/omnicasa/interface';
import { Subscription } from 'rxjs';

/**
 * Composant d'administration pour gérer l'ordre d'affichage des biens à la une
 * 
 * Principe de fonctionnement :
 * - Chaque bien a un champ 'id' qui représente sa position dans l'ordre (0, 1, 2, 3...)
 * - L'ordre est sauvegardé dans Firestore avec ce champ 'id'
 * - Le front affiche les biens triés par 'id' croissant
 */
@Component({
  selector: 'app-top-biens',
  templateUrl: './top-biens.component.html',
  styleUrls: ['./top-biens.component.css', '../../view-property-list/view-property-list.component.css']
})
export class TopBiensComponent implements OnInit, OnDestroy {

  // Liste complète des biens à la une (tous les biens)
  topPropertyList: Property[] = [];
  
  // Liste filtrée pour l'affichage (selon le filtre à vendre/à louer)
  filteredPropertyList: Property[] = [];
  
  // État de l'interface
  isSaving = false;
  hasChanges = false;
  private isSavingToFirestore = false; // Flag pour indiquer qu'on est en train de sauvegarder
  
  // Image placeholder par défaut
  placeholderImage = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23ddd" width="400" height="300"/%3E%3Ctext fill="rgba(0,0,0,0.5)" font-family="sans-serif" font-size="30" dy="10.5" font-weight="bold" x="50%25" y="50%25" text-anchor="middle"%3EImage%3C/text%3E%3C/svg%3E';
  
  private subscription: Subscription;

  constructor(
    private firestore: FirestoreService
  ) {}

  ngOnInit(): void {
    this.loadProperties();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  /**
   * Charge les biens à la une depuis Firestore
   */
  private loadProperties(): void {
    this.subscription = this.firestore.activeProperties$.subscribe(data => {
      // Ignorer les mises à jour si l'utilisateur a des modifications non sauvegardées
      // ou si on est en train de sauvegarder (pour éviter les conflits)
      if (this.hasChanges || this.isSavingToFirestore) {
        if (this.hasChanges) {
          console.log('⏸️ Mise à jour ignorée : modifications locales en cours');
        } else if (this.isSavingToFirestore) {
          console.log('⏸️ Mise à jour ignorée : sauvegarde en cours');
        }
        return;
      }

      const newList = data
        .map(e => {
          const propertyData = e.payload.doc.data() as Property;
          return {
            id: this.normalizeId(propertyData.id),
            ...propertyData
          };
        })
        .filter(e => e.SubStatus === 2 || e.SubStatus === 3)
        .sort((a, b) => a.id - b.id);

      // Normaliser les IDs pour garantir un ordre séquentiel (0, 1, 2, 3...)
      const idsBeforeNormalization = newList.map(p => p.id);
      this.normalizeIds(newList);
      const idsAfterNormalization = newList.map(p => p.id);
      const idsWereNormalized = JSON.stringify(idsBeforeNormalization) !== JSON.stringify(idsAfterNormalization);

      // Mettre à jour seulement si la liste a changé
      if (this.hasListChanged(newList)) {
        this.topPropertyList = newList;
        this.applyFilter();
        console.log(`✅ ${this.topPropertyList.length} biens à la une chargés`);
        
        // Si les IDs ont été normalisés, sauvegarder automatiquement
        // Mais seulement si l'utilisateur n'a pas de modifications en cours
        if (idsWereNormalized && !this.hasChanges) {
          console.log('💾 Sauvegarde automatique des IDs normalisés...');
          this.firestore.savePropertyTop(this.topPropertyList);
        }
      }
    });
  }

  /**
   * Normalise un ID (remplace les valeurs invalides par 999999)
   */
  private normalizeId(id: any): number {
    return (id !== undefined && id !== null && typeof id === 'number' && id >= 0) ? id : 999999;
  }

  /**
   * Normalise tous les IDs pour garantir un ordre séquentiel (0, 1, 2, 3...)
   * Réindexe toujours pour s'assurer que les IDs commencent à 0
   */
  private normalizeIds(properties: Property[]): void {
    if (!properties || properties.length === 0) {
      return;
    }

    // Trier d'abord par ID actuel (en normalisant les IDs invalides)
    const sortedProperties = [...properties].sort((a, b) => {
      const idA = this.normalizeId(a.id);
      const idB = this.normalizeId(b.id);
      return idA - idB;
    });

    // Vérifier si la normalisation est nécessaire
    // (IDs invalides, ou IDs qui ne commencent pas à 0, ou IDs non séquentiels)
    const firstId = sortedProperties.length > 0 ? this.normalizeId(sortedProperties[0].id) : 0;
    const hasInvalidIds = sortedProperties.some(p => this.normalizeId(p.id) >= 999999);
    const notStartingAtZero = firstId !== 0;
    const notSequential = sortedProperties.some((p, index) => {
      const normalizedId = this.normalizeId(p.id);
      // Vérifier que l'ID correspond à l'index (0, 1, 2, 3...)
      return normalizedId !== index;
    });
    
    const needsReindexing = hasInvalidIds || notStartingAtZero || notSequential;
    
    if (needsReindexing) {
      // Réindexer tous les biens pour qu'ils commencent à 0, 1, 2, 3...
      sortedProperties.forEach((property, index) => {
        property.id = index;
      });
      
      // Mettre à jour la liste originale avec les nouveaux IDs
      // On crée une map pour retrouver rapidement les propriétés
      const idMap = new Map(sortedProperties.map(p => [p.ID, p]));
      properties.forEach(property => {
        const sortedProperty = idMap.get(property.ID);
        if (sortedProperty) {
          property.id = sortedProperty.id;
        }
      });
      
      console.log('🔄 Réindexation des biens effectuée - IDs normalisés de 0 à', properties.length - 1);
    }
  }

  /**
   * Vérifie si la liste a changé
   * Compare les IDs de propriété (ID) et leurs positions (id) pour détecter les changements réels
   */
  private hasListChanged(newList: Property[]): boolean {
    if (!this.topPropertyList || this.topPropertyList.length !== newList.length) {
      return true;
    }

    // Créer une map des positions actuelles par ID de propriété
    const currentMap = new Map<number, number>();
    this.topPropertyList.forEach(p => {
      currentMap.set(p.ID, p.id);
    });

    // Vérifier si les positions ont changé pour chaque propriété
    for (const property of newList) {
      const currentPosition = currentMap.get(property.ID);
      if (currentPosition === undefined || currentPosition !== property.id) {
        return true; // Une propriété a changé de position ou est nouvelle
      }
    }
    
    return false; // Aucun changement détecté
  }

  /**
   * Gère le drop d'un élément lors du drag & drop
   */
  drop(event: CdkDragDrop<Property[]>): void {
    if (event.previousIndex === event.currentIndex) {
      return; // Aucun changement
    }

    // Déplacer l'élément dans la liste filtrée
    moveItemInArray(this.filteredPropertyList, event.previousIndex, event.currentIndex);

    // Mettre à jour l'ordre global (cela met aussi à jour les IDs)
    this.updateGlobalOrder();

    // Pas besoin de réappliquer le filtre car filteredPropertyList est déjà dans le bon ordre
    // et updateGlobalOrder() a mis à jour les IDs correctement

    this.hasChanges = true;
  }

  /**
   * Met à jour l'ordre global (topPropertyList) en fonction de l'ordre de la liste filtrée
   */
  private updateGlobalOrder(): void {
    if (!this.topPropertyList || !this.filteredPropertyList) {
      return;
    }

    // La liste filtrée = liste complète (pas de filtres)
    this.filteredPropertyList.forEach((property, index) => {
      property.id = index;
    });
    this.topPropertyList = [...this.filteredPropertyList];
  }

  /**
   * Sauvegarde l'ordre actuel dans Firestore
   */
  save(): void {
    if (!this.hasChanges) {
      console.log('ℹ️ Aucune modification à sauvegarder');
      return;
    }

    this.isSaving = true;
    this.isSavingToFirestore = true; // Marquer qu'on est en train de sauvegarder
    
    // Normaliser les IDs avant sauvegarde
    this.normalizeIds(this.topPropertyList);
    
    console.log('💾 Début de la sauvegarde...', this.topPropertyList.length, 'biens');
    
    // Sauvegarder dans Firestore
    this.firestore.savePropertyTop(this.topPropertyList);
    
    // Attendre un peu pour que la sauvegarde soit effectuée
    // Puis marquer les changements comme sauvegardés
    setTimeout(() => {
      this.isSaving = false;
      this.isSavingToFirestore = false; // Plus besoin d'ignorer les mises à jour
      this.hasChanges = false;
      console.log('✅ Ordre sauvegardé avec succès');
    }, 2000);
  }

  /**
   * Réinitialise l'ordre à l'ordre initial (trié par ID)
   */
  resetOrder(): void {
    if (!this.topPropertyList || this.topPropertyList.length === 0) {
      return;
    }

    // Trier par ID croissant
    this.topPropertyList.sort((a, b) => a.id - b.id);
    
    // Réappliquer le filtre
    this.applyFilter();
    
    this.hasChanges = false;
  }

  /**
   * Applique le filtre (affiche tous les biens triés par id)
   */
  applyFilter(): void {
    if (!this.topPropertyList) {
      this.filteredPropertyList = [];
      return;
    }

    // Afficher tous les biens triés par id
    this.filteredPropertyList = [...this.topPropertyList].sort((a, b) => a.id - b.id);
  }

  /**
   * Retourne l'URL de l'image d'une propriété
   */
  getImageUrl(property: Property): string {
    if (property.LargePicture && property.LargePicture.trim() !== '') {
      return property.LargePicture;
    }
    if (property.LargePictures && property.LargePictures.length > 0 && property.LargePictures[0]) {
      return property.LargePictures[0];
    }
    return this.placeholderImage;
  }

  /**
   * Gère les erreurs de chargement d'image
   */
  onImageError(event: any): void {
    event.target.src = this.placeholderImage;
  }

  /**
   * Retourne la position globale d'une propriété (basée sur id)
   */
  getGlobalPosition(property: Property): number {
    if (!property || property.id === undefined || property.id === null) {
      return 0;
    }
    return property.id + 1; // id commence à 0, position commence à 1
  }

  /**
   * Monte un bien d'une position dans la liste filtrée
   */
  moveUp(index: number): void {
    if (index <= 0 || !this.filteredPropertyList || this.filteredPropertyList.length === 0) {
      return;
    }

    // Échanger avec l'élément précédent
    const temp = this.filteredPropertyList[index];
    this.filteredPropertyList[index] = this.filteredPropertyList[index - 1];
    this.filteredPropertyList[index - 1] = temp;

    // Mettre à jour l'ordre global (cela met aussi à jour les IDs)
    this.updateGlobalOrder();

    // Pas besoin de réappliquer le filtre car filteredPropertyList est déjà dans le bon ordre

    this.hasChanges = true;
  }

  /**
   * Descend un bien d'une position dans la liste filtrée
   */
  moveDown(index: number): void {
    if (index < 0 || !this.filteredPropertyList || index >= this.filteredPropertyList.length - 1) {
      return;
    }

    // Échanger avec l'élément suivant
    const temp = this.filteredPropertyList[index];
    this.filteredPropertyList[index] = this.filteredPropertyList[index + 1];
    this.filteredPropertyList[index + 1] = temp;

    // Mettre à jour l'ordre global (cela met aussi à jour les IDs)
    this.updateGlobalOrder();

    // Pas besoin de réappliquer le filtre car filteredPropertyList est déjà dans le bon ordre

    this.hasChanges = true;
  }

}
