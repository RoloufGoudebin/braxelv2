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

  // Indicateur de mode fallback
  private isFallbackModeSubject = new BehaviorSubject<boolean>(false);
  public isFallbackMode$ = this.isFallbackModeSubject.asObservable();

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
    this.isFallbackModeSubject.next(false);
  }

  // Logique de recherche optimisée
  private performSearch(criteria: SearchCriteria, allProperties: Property[]): Property[] {
    console.log('🔍 DEBUT RECHERCHE');
    console.log('Total propriétés:', allProperties.length);
    console.log('Goal recherché:', criteria.goal === 0 ? 'ACHAT' : 'LOCATION');
    
    if (!criteria || allProperties.length === 0) {
      console.log('⚠️ Pas de critères ou pas de propriétés');
      return [];
    }

    // LOGS : Analyser les SubStatus dans la BDD
    const subStatusCounts = new Map<number, number>();
    allProperties.forEach(p => {
      if (p.Goal === criteria.goal) {
        subStatusCounts.set(p.SubStatus, (subStatusCounts.get(p.SubStatus) || 0) + 1);
      }
    });
    console.log('📊 SubStatus pour Goal', criteria.goal, ':', Array.from(subStatusCounts.entries()));

    // PREMIER PASSAGE : Collecter TOUTES les propriétés du bon Goal (TOUS SubStatus)
    const allPropertiesForGoal: Property[] = [];
    for (let i = 0; i < allProperties.length; i++) {
      const property = allProperties[i];
      if (property.Goal === criteria.goal) {
        allPropertiesForGoal.push(property);
      }
    }
    
    console.log('🏠 Total propriétés pour ce Goal:', allPropertiesForGoal.length);

    // DEUXIÈME PASSAGE : Filtrage normal
    const availableResults: Property[] = [];
    const soldResults: Property[] = [];
    
    for (let i = 0; i < allProperties.length; i++) {
      const property = allProperties[i];
      
      // Filtre Goal
      if (property.Goal !== criteria.goal) continue;
      
      const isAvailable = property.SubStatus === 2 || property.SubStatus === 3;
      const isSold = property.SubStatus === 4 || property.SubStatus === 5;

      // Appliquer tous les autres filtres
      let passesFilters = true;
      
      if (criteria.minPrice !== null && property.Price < criteria.minPrice) passesFilters = false;
      if (criteria.maxPrice !== null && property.Price > criteria.maxPrice) passesFilters = false;
      if (criteria.propertyTypes.length > 0 && !criteria.propertyTypes.includes(property.WebID)) passesFilters = false;
      
      const propertyZip = Number(property.Zip);
      const matchesLocation = criteria.zipCodes.length === 0 || criteria.zipCodes.includes(propertyZip);
      if (!matchesLocation) passesFilters = false;
      
      if (criteria.selectedRooms.length > 0) {
        const rooms = property.NumberOfBedRooms || 0;
        const roomMatches = criteria.selectedRooms.some(selectedRoom => 
          selectedRoom === 5 ? rooms >= 4 : rooms === selectedRoom
        );
        if (!roomMatches) passesFilters = false;
      }

      if (criteria.showUnderOption === false && property.Marquee) passesFilters = false;
      if (criteria.showWithTerrace && (!property.SurfaceTerrace || property.SurfaceTerrace <= 0)) passesFilters = false;
      if (criteria.showWithGarden && !property.HasGarden) passesFilters = false;
      if (criteria.showWithGarage && (!property.NumberOfGarages || property.NumberOfGarages <= 0)) passesFilters = false;
      if (criteria.minSurface !== null && (!property.SurfaceTotal || property.SurfaceTotal < criteria.minSurface)) passesFilters = false;
      if (criteria.maxSurface !== null && (!property.SurfaceTotal || property.SurfaceTotal > criteria.maxSurface)) passesFilters = false;
      if (criteria.minConstructionYear !== null && (!property.ConstructionYear || property.ConstructionYear < criteria.minConstructionYear)) passesFilters = false;
      if (criteria.maxConstructionYear !== null && (!property.ConstructionYear || property.ConstructionYear > criteria.maxConstructionYear)) passesFilters = false;

      if (passesFilters) {
        if (isAvailable) {
          availableResults.push(property);
        } else if (isSold) {
          soldResults.push(property);
        }
      }
    }

    console.log('✅ Disponibles trouvés:', availableResults.length);
    console.log('🏘️ Réalisations trouvées:', soldResults.length);

    // LOGIQUE DE RETOUR
    if (availableResults.length > 0) {
      console.log('✨ Retour: biens disponibles');
      this.isFallbackModeSubject.next(false);
      return availableResults.sort((a, b) => a.id - b.id);
    }
    
    if (soldResults.length > 0) {
      console.log('✨ Retour: réalisations avec filtres');
      this.isFallbackModeSubject.next(false);
      return soldResults.sort((a, b) => a.id - b.id);
    }
    
    // FALLBACK ABSOLU : Retourner TOUTES les propriétés du Goal
    console.log('🔴 FALLBACK FINAL: Affichage de TOUTES les propriétés du Goal:', allPropertiesForGoal.length);
    this.isFallbackModeSubject.next(allPropertiesForGoal.length > 0);
    return allPropertiesForGoal.sort((a, b) => a.id - b.id);
  }
} 