import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Property } from './omnicasa/interface';

export interface SearchCriteria {
  goal: number; // 0 = Achat, 1 = Location
  location: string;
  propertyTypes: number[];
  zipCodes: number[];
  selectedRooms: number[];
  minPrice: number | null;
  maxPrice: number | null;
  // Filtres avancés
  showUnderOption?: boolean; // Par défaut true - si false, masque les biens sous option
  showWithTerrace?: boolean;
  showWithGarden?: boolean;
  showWithGarage?: boolean;
  minSurface?: number | null;
  maxSurface?: number | null;
  minConstructionYear?: number | null;
  maxConstructionYear?: number | null;
}

@Injectable({
  providedIn: 'root'
})
export class PropertySearchService {
  private searchCriteriaSubject = new BehaviorSubject<SearchCriteria | null>(null);
  public searchCriteria$ = this.searchCriteriaSubject.asObservable().pipe(
    debounceTime(150), // Optimisation: augmentation du debounce pour réduire les appels
    distinctUntilChanged()
  );

  private searchResultsSubject = new BehaviorSubject<Property[]>([]);
  public searchResults$ = this.searchResultsSubject.asObservable().pipe(
    debounceTime(100),
    distinctUntilChanged((prev, curr) => 
      prev.length === curr.length && prev.every((p, i) => p.ID === curr[i]?.ID)
    ) // Optimisation: comparaison plus efficace basée sur les IDs
  );

  private allPropertiesSubject = new BehaviorSubject<Property[]>([]);
  public allProperties$ = this.allPropertiesSubject.asObservable();

  constructor() {
    // Service initialisé sans session restoration pour de meilleures performances
  }

  // Mise à jour des critères de recherche et déclenchement de la recherche
  updateSearchCriteria(criteria: SearchCriteria): void {
    this.searchCriteriaSubject.next(criteria);
    
    const allProperties = this.allPropertiesSubject.value;
    if (allProperties.length > 0) {
      const results = this.performSearch(criteria, allProperties);
      this.searchResultsSubject.next(results);
    }
  }

  // Définition de toutes les propriétés (depuis Firestore)
  setAllProperties(properties: Property[]): void {
    this.allPropertiesSubject.next(properties);
    
    const criteria = this.searchCriteriaSubject.value;
    if (criteria) {
      const results = this.performSearch(criteria, properties);
      this.searchResultsSubject.next(results);
    }
  }

  // Getters optimisés
  getCurrentCriteria(): SearchCriteria | null {
    return this.searchCriteriaSubject.value;
  }

  getCurrentResults(): Property[] {
    return this.searchResultsSubject.value;
  }

  getCurrentProperties(): Property[] {
    return this.allPropertiesSubject.value;
  }

  // Effacer la recherche
  clearSearch(): void {
    this.searchCriteriaSubject.next(null);
    this.searchResultsSubject.next([]);
  }

  // Logique de recherche optimisée
  private performSearch(criteria: SearchCriteria, allProperties: Property[]): Property[] {
    if (!criteria || allProperties.length === 0) {
      return [];
    }

    const results: Property[] = [];
    
    // Optimisation: utilisation d'une boucle for classique plus rapide
    for (let i = 0; i < allProperties.length; i++) {
      const property = allProperties[i];
      
      // Filtres de base (ordre optimisé par fréquence d'échec)
      if (property.SubStatus !== 2 && property.SubStatus !== 3) continue;
      if (property.Goal !== criteria.goal) continue;

      // Filtres numériques (plus rapides à vérifier)
      if (criteria.minPrice !== null && property.Price < criteria.minPrice) continue;
      if (criteria.maxPrice !== null && property.Price > criteria.maxPrice) continue;

      // Filtres sur les tableaux
      if (criteria.propertyTypes.length > 0 && !criteria.propertyTypes.includes(property.WebID)) continue;
      
      if (criteria.zipCodes.length > 0) {
        const propertyZip = Number(property.Zip);
        if (!criteria.zipCodes.includes(propertyZip)) continue;
      }

      // Filtre chambres avec logique optimisée
      if (criteria.selectedRooms.length > 0) {
        const rooms = property.NumberOfBedRooms || 0;
        const roomMatches = criteria.selectedRooms.some(selectedRoom => 
          selectedRoom === 5 ? rooms >= 4 : rooms === selectedRoom
        );
        if (!roomMatches) continue;
      }

      // Filtres avancés
      if (criteria.showUnderOption === false && property.Marquee) continue;
      if (criteria.showWithTerrace && (!property.SurfaceTerrace || property.SurfaceTerrace <= 0)) continue;
      if (criteria.showWithGarden && !property.HasGarden) continue;
      if (criteria.showWithGarage && (!property.NumberOfGarages || property.NumberOfGarages <= 0)) continue;

      // Filtres de surface
      if (criteria.minSurface !== null && (!property.SurfaceTotal || property.SurfaceTotal < criteria.minSurface)) continue;
      if (criteria.maxSurface !== null && (!property.SurfaceTotal || property.SurfaceTotal > criteria.maxSurface)) continue;

      // Filtres d'année de construction
      if (criteria.minConstructionYear !== null && (!property.ConstructionYear || property.ConstructionYear < criteria.minConstructionYear)) continue;
      if (criteria.maxConstructionYear !== null && (!property.ConstructionYear || property.ConstructionYear > criteria.maxConstructionYear)) continue;

      results.push(property);
    }

    // Tri optimisé : d'abord par id (position admin), puis par SubStatus
    return results.sort((a, b) => {
      const idDiff = a.id - b.id;
      if (idDiff !== 0) return idDiff;
      
      // Logique SubStatus optimisée
      const aHasSpecialStatus = a.SubStatus === 2 || a.SubStatus === 3;
      const bHasSpecialStatus = b.SubStatus === 2 || b.SubStatus === 3;
      
      if (aHasSpecialStatus && !bHasSpecialStatus) return -1;
      if (!aHasSpecialStatus && bHasSpecialStatus) return 1;
      return 0;
    });
  }
} 