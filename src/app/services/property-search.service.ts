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
}

@Injectable({
  providedIn: 'root'
})
export class PropertySearchService {

  private searchCriteriaSubject = new BehaviorSubject<SearchCriteria | null>(null);
  public searchCriteria$ = this.searchCriteriaSubject.asObservable().pipe(
    debounceTime(100),
    distinctUntilChanged()
  );

  private searchResultsSubject = new BehaviorSubject<Property[]>([]);
  public searchResults$ = this.searchResultsSubject.asObservable().pipe(
    debounceTime(100),
    distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr))
  );

  private allPropertiesSubject = new BehaviorSubject<Property[]>([]);
  public allProperties$ = this.allPropertiesSubject.asObservable().pipe(
    debounceTime(100),
    distinctUntilChanged()
  );

  constructor() {
    // No session restoration - search criteria reset on page refresh
  }

  // Update search criteria and trigger search
  updateSearchCriteria(criteria: SearchCriteria) {
    this.searchCriteriaSubject.next(criteria);
    
    // Trigger search if we have properties
    const allProperties = this.allPropertiesSubject.value;
    if (allProperties.length > 0) {
      const results = this.performSearch(criteria, allProperties);
      this.searchResultsSubject.next(results);
    }
  }

  // Set all properties (from Firestore)
  setAllProperties(properties: Property[]) {
    this.allPropertiesSubject.next(properties);
    
    // Re-run search if we have criteria
    const criteria = this.searchCriteriaSubject.value;
    if (criteria) {
      const results = this.performSearch(criteria, properties);
      this.searchResultsSubject.next(results);
    }
  }

  // Get current search criteria
  getCurrentCriteria(): SearchCriteria | null {
    return this.searchCriteriaSubject.value;
  }

  // Get current search results
  getCurrentResults(): Property[] {
    return this.searchResultsSubject.value;
  }

  // Get current properties
  getCurrentProperties(): Property[] {
    return this.allPropertiesSubject.value;
  }

  // Clear search
  clearSearch() {
    this.searchCriteriaSubject.next(null);
    this.searchResultsSubject.next([]);
  }

  // Perform the actual search logic (adapted from our-biens component)
  private performSearch(criteria: SearchCriteria, allProperties: Property[]): Property[] {
    const results: Property[] = [];
    
    for (let i = allProperties.length - 1; i >= 0; i--) {
      const property = allProperties[i];
      
      // Only include available properties
      if (property.SubStatus !== 2 && property.SubStatus !== 3) {
        continue;
      }

      // Check goal (Achat/Location)
      if (property.Goal !== criteria.goal) {
        continue;
      }

      // Check property type
      if (criteria.propertyTypes.length > 0 && !criteria.propertyTypes.includes(property.WebID)) {
        continue;
      }

      // Check zip codes
      if (criteria.zipCodes.length > 0) {
        const propertyZip = Number(property.Zip);
        if (!criteria.zipCodes.includes(propertyZip)) {
          continue;
        }
      }

      // Check rooms
      if (criteria.selectedRooms.length > 0) {
        const rooms = property.NumberOfBedRooms || 0;
        let roomMatches = false;
        
        for (const selectedRoom of criteria.selectedRooms) {
          if (selectedRoom === 5) { // 4+ chambres
            if (rooms >= 4) {
              roomMatches = true;
              break;
            }
          } else {
            if (rooms === selectedRoom) {
              roomMatches = true;
              break;
            }
          }
        }
        
        if (!roomMatches) {
          continue;
        }
      }

      // Check price
      if (criteria.minPrice !== null && property.Price < criteria.minPrice) {
        continue;
      }
      if (criteria.maxPrice !== null && property.Price > criteria.maxPrice) {
        continue;
      }

      results.push(property);
    }

    return results;
  }


} 