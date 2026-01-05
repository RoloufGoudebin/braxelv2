import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import data from '../json/zip.json';
import { Property } from '../services/omnicasa/interface';
import { PropertySearchService, SearchCriteria } from '../services/property-search.service';

interface ZipOption {
  zip: number;
  localite: string;
  count: number;
  displayText: string;
}

interface ProvinceGroup {
  province: string;
  zipOptions: ZipOption[];
}

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent implements OnInit {

  constructor(
    private searchService: PropertySearchService,
    private translate: TranslateService
  ) { }

  // Convert type ID to goal number (for Omnicasa API)
  private getSelectedGoal(): number {
    const activeType = this.types.find(type => type.active);
    return activeType?.id === 'sale' ? 0 : 1; // 0 = Achat, 1 = Location
  }

  types = [
    { id: 'sale', name: 'search.3', active: true },
    { id: 'rental', name: 'search.4', active: false }
  ]

  // Property types (matching the ones from our-biens)
  propertyTypes = [
    { id: 1, name: 'navbar.16.a', count: 0 },
    { id: 2, name: 'navbar.16.b', count: 0 },
    { id: 3, name: 'navbar.16.c', count: 0 },
    { id: 4, name: 'navbar.16.d', count: 0 },
    { id: 5, name: 'navbar.16.e', count: 0 },
    { id: 6, name: 'navbar.16.f', count: 0 },
    { id: 7, name: 'navbar.16.g', count: 0 },
  ];

  // Multi-sélection pour les types de biens
  selectedPropertyTypes: number[] = [];
  isPropertyTypeDropdownOpen = false;

  // List of zip codes
  listOfZips = data.sort((a: any, b: any) => {
    if (a.localite < b.localite) return -1;
    if (a.localite > b.localite) return 1;
    return 0;
  }).map(item => ({
    ...item,
    localite: item.localite.toUpperCase(),
    zip: Number(item.zip)
  }));

  // Available zip codes with property counts
  availableZips: ZipOption[] = [];
  filteredZips: ZipOption[] = [];
  filteredProvinces: ProvinceGroup[] = [];

  isPriceDropdownOpen = false;
  minPrice: number | null = null;
  maxPrice: number | null = null;
  suggestedMinPrice: number | null = null;
  suggestedMaxPrice: number | null = null;

  isRoomsDropdownOpen = false;
  selectedRooms: number[] = [];
  allRoomOptions = [
    { value: 1, label: '1', count: 0 },
    { value: 2, label: '2', count: 0 },
    { value: 3, label: '3', count: 0 },
    { value: 4, label: '4', count: 0 },
    { value: 5, label: '5+', count: 0 }
  ];
  availableRoomOptions: any[] = [];

  // Sous-types de biens
  subTypeOptions: Array<{ value: string; count: number }> = [];
  selectedSubTypes: string[] = [];
  isSubTypeDropdownOpen = false;

  // État du bien
  conditionOptions: Array<{ value: string; count: number }> = [];
  selectedConditions: string[] = [];
  isConditionDropdownOpen = false;

  isLocationDropdownOpen = false;
  selectedLocations: string[] = [];

  // Filtres avancés
  isAdvancedFiltersOpen = false;
  showWithTerrace = false;
  showWithGarden = false;
  
  isSurfaceDropdownOpen = false;
  minSurface: number | null = null;
  maxSurface: number | null = null;
  suggestedMinSurface: number | null = null;
  suggestedMaxSurface: number | null = null;

  isGardenSurfaceDropdownOpen = false;
  minGardenSurface: number | null = null;
  maxGardenSurface: number | null = null;

  isGarageDropdownOpen = false;
  minGarageCount: number | null = null;
  garageOptions = [
    { value: 1, label: '1+' },
    { value: 2, label: '2+' },
    { value: 3, label: '3+' }
  ];

  // Form controls
  searchForm = new FormGroup({
    location: new FormControl(''),
    propertyType: new FormControl(''),
    minPrice: new FormControl(null),
    maxPrice: new FormControl(null),
    minSurface: new FormControl(null),
    maxSurface: new FormControl(null),
    minGardenSurface: new FormControl(null),
    maxGardenSurface: new FormControl(null),
    minGarageCount: new FormControl(null),
    showWithTerrace: new FormControl(false),
    showWithGarden: new FormControl(false)
  })

  ngOnInit(): void {
    // Abonnement aux propriétés pour calculer les compteurs
    this.searchService.allProperties$.subscribe(properties => {
      this.updateAvailableZips(properties);
    });

    // Abonnement aux changements de critères de recherche pour synchroniser l'UI
    this.searchService.searchCriteria$.subscribe(criteria => {
      if (criteria) {
        this.restoreSearchCriteria(criteria);
      }
    });
  }

  // Determine Belgian province from zip code
  getProvinceFromZip(zip: number): string {
    if (zip >= 1000 && zip <= 1299) {
      return 'Bruxelles-Capitale';
    } else if (zip >= 1300 && zip <= 1499) {
      return 'Brabant Wallon';
    } else if (zip >= 1500 && zip <= 1999) {
      return 'Brabant Flamand';
    } else if (zip >= 2000 && zip <= 2999) {
      return 'Anvers';
    } else if (zip >= 3000 && zip <= 3499) {
      return 'Brabant Flamand';
    } else if (zip >= 3500 && zip <= 3999) {
      return 'Limbourg';
    } else if (zip >= 4000 && zip <= 4999) {
      return 'Liège';
    } else if (zip >= 5000 && zip <= 5999) {
      return 'Namur';
    } else if (zip >= 6000 && zip <= 6599) {
      return 'Hainaut';
    } else if (zip >= 6600 && zip <= 6999) {
      return 'Luxembourg';
    } else if (zip >= 7000 && zip <= 7999) {
      return 'Hainaut';
    } else if (zip >= 8000 && zip <= 8999) {
      return 'Flandre Occidentale';
    } else if (zip >= 9000 && zip <= 9999) {
      return 'Flandre Orientale';
    } else {
      return 'Autre';
    }
  }

  // Méthode commune pour appliquer les filtres de base (optimisation)
  private applyBaseFilters(properties: Property[], excludeFilters: string[] = []): Property[] {
    const selectedGoal = this.getSelectedGoal();
    const selectedLocationZips = this.getZipCodesFromSelectedLocations();
    const selectedPropertyType = this.searchForm.get('propertyType')?.value;
    const normalizedSubTypes = this.selectedSubTypes.map(subType => subType.toLowerCase());
    const normalizedConditions = this.selectedConditions.map(condition => condition.toLowerCase());

    return properties.filter(property => {
      // Filtres obligatoires - MODIFIER POUR INCLURE TOUS LES BIENS (SubStatus 2,3,4,5)
      if (property.SubStatus !== 2 && property.SubStatus !== 3 && property.SubStatus !== 4 && property.SubStatus !== 5) return false;
      if (property.Goal !== selectedGoal) return false;

      // Filtre localisation (sauf si exclu)
      if (!excludeFilters.includes('location') && selectedLocationZips.length > 0) {
        const propertyZip = Number(property.Zip);
        if (!selectedLocationZips.includes(propertyZip)) return false;
      }

      // Filtre type de propriété (sauf si exclu)
      if (!excludeFilters.includes('propertyType') && selectedPropertyType && Number(selectedPropertyType) !== property.WebID) return false;

      // Filtre chambres (sauf si exclu)
      if (!excludeFilters.includes('rooms') && this.selectedRooms.length > 0) {
        const rooms = property.NumberOfBedRooms || 0;
        const roomMatches = this.selectedRooms.some(selectedRoom => 
          selectedRoom === 5 ? rooms >= 4 : rooms === selectedRoom
        );
        if (!roomMatches) return false;
      }

      if (normalizedSubTypes.length > 0) {
        const subType = (property.MainTypeName || '').toLowerCase();
        if (!subType || !normalizedSubTypes.includes(subType)) return false;
      }

      if (normalizedConditions.length > 0) {
        const propertyCondition = (property.ConditionName || '').toLowerCase();
        if (!propertyCondition || !normalizedConditions.includes(propertyCondition)) return false;
      }

      // Filtre prix (sauf si exclu)
      if (!excludeFilters.includes('price')) {
        if (this.minPrice && property.Price < this.minPrice) return false;
        if (this.maxPrice && property.Price > this.maxPrice) return false;
      }

      // Filtres avancés
      if (this.showWithTerrace && (!property.SurfaceTerrace || property.SurfaceTerrace <= 0)) return false;
      if (this.showWithGarden && !property.HasGarden) return false;
      if (this.minSurface !== null && (!property.SurfaceTotal || property.SurfaceTotal < this.minSurface)) return false;
      if (this.maxSurface !== null && (!property.SurfaceTotal || property.SurfaceTotal > this.maxSurface)) return false;
      if (this.minGardenSurface !== null && (!property.SurfaceGarden || property.SurfaceGarden < this.minGardenSurface)) return false;
      if (this.maxGardenSurface !== null && (!property.SurfaceGarden || property.SurfaceGarden > this.maxGardenSurface)) return false;
      if (this.minGarageCount !== null) {
        const garages = property.NumberOfGarages || 0;
        if (garages < this.minGarageCount) return false;
      }

      return true;
    });
  }

  updateAvailableZips(properties: Property[]): void {
    // Filtrer les propriétés (exclure la localisation pour éviter la dépendance circulaire)
    const filteredProperties = this.applyBaseFilters(properties, ['location']);

    // Compter UNIQUEMENT les propriétés DISPONIBLES (SubStatus 2,3) par code postal
    // Car ce sont celles qui seront affichées en priorité
    const zipCounts = new Map<number, number>();
    filteredProperties.forEach(property => {
      // Ne compter que les biens disponibles pour les compteurs
      if (property.SubStatus === 2 || property.SubStatus === 3) {
        const zipNumber = Number(property.Zip);
        zipCounts.set(zipNumber, (zipCounts.get(zipNumber) || 0) + 1);
      }
    });

    // CPs prioritaires à mettre en premier
    const priorityZips = [1410, 1420, 1380, 1640, 1180];

    // Créer la liste de TOUS les codes postaux (sans compteur)
    this.availableZips = this.listOfZips.map(zipInfo => {
      const count = zipCounts.get(zipInfo.zip) || 0;
      return {
        zip: zipInfo.zip,
        localite: zipInfo.localite,
        count,
        displayText: `${zipInfo.zip} ${zipInfo.localite}`
      };
    });

    // Tri personnalisé : CPs prioritaires d'abord, puis par localité
    this.availableZips.sort((a, b) => {
      const aIsPriority = priorityZips.includes(a.zip);
      const bIsPriority = priorityZips.includes(b.zip);
      
      // Si les deux sont prioritaires, trier selon l'ordre de priorité
      if (aIsPriority && bIsPriority) {
        return priorityZips.indexOf(a.zip) - priorityZips.indexOf(b.zip);
      }
      
      // Les prioritaires en premier
      if (aIsPriority) return -1;
      if (bIsPriority) return 1;
      
      // Pour les autres, tri alphabétique par localité
      return a.localite.localeCompare(b.localite);
    });

    this.filteredZips = [...this.availableZips];

    // Grouper par provinces
    this.groupZipsByProvince(this.availableZips);

    // Mettre à jour les filtres intelligents
    this.updateSmartFilters(properties);
  }

  updateSmartFilters(properties: Property[]): void {
    const baseFilteredProperties = this.applyBaseFilters(properties);
    
    // Mise à jour simultanée de tous les filtres intelligents
    this.updatePropertyTypeCounts(baseFilteredProperties);
    this.updateAvailableRooms(baseFilteredProperties);
    this.updateSubTypeOptions(baseFilteredProperties);
    this.updateConditionOptions(baseFilteredProperties);
    this.updatePriceSuggestions(baseFilteredProperties);
  }

  updatePropertyTypeCounts(properties: Property[]): void {
    // Appliquer les filtres actuels (exclure le type de propriété)
    const filteredProperties = this.applyBaseFilters(properties, ['propertyType']);

    // Compter par type de propriété avec optimisation Map
    const typeCounts = new Map<number, number>();
    filteredProperties.forEach(property => {
      typeCounts.set(property.WebID, (typeCounts.get(property.WebID) || 0) + 1);
    });

    // Mettre à jour les compteurs
    this.propertyTypes.forEach(propertyType => {
      propertyType.count = typeCounts.get(propertyType.id) || 0;
    });
  }

  updateAvailableRooms(properties: Property[]): void {
    // Appliquer les filtres actuels (exclure les chambres)
    const filteredProperties = this.applyBaseFilters(properties, ['rooms']);

    // Compter par nombre de chambres avec optimisation Map
    const roomCounts = new Map<number, number>();
    filteredProperties.forEach(property => {
      const rooms = property.NumberOfBedRooms || 0;
      roomCounts.set(rooms, (roomCounts.get(rooms) || 0) + 1);
    });

    // Mettre à jour les options disponibles
    this.availableRoomOptions = this.allRoomOptions
      .map(roomOption => {
        const count = roomOption.value === 5 
          ? Array.from(roomCounts.entries()).filter(([rooms]) => rooms >= 4).reduce((sum, [, count]) => sum + count, 0)
          : roomCounts.get(roomOption.value) || 0;
        
        return { ...roomOption, count };
      });
      // Supprimer le filtre .filter(option => option.count > 0) pour toujours afficher toutes les options

    // Ne plus nettoyer les sélections - garder toutes les sélections utilisateur
    // this.selectedRooms = this.selectedRooms.filter(selectedRoom =>
    //   this.availableRoomOptions.some(option => option.value === selectedRoom)
    // );
  }

  updateSubTypeOptions(properties: Property[]): void {
    const counts = new Map<string, number>();
    properties.forEach(property => {
      const subType = property.MainTypeName?.trim();
      if (subType) {
        counts.set(subType, (counts.get(subType) || 0) + 1);
      }
    });

    // Tri personnalisé : Maison en premier, Villa en second, puis ordre alphabétique
    this.subTypeOptions = Array.from(counts.entries())
      .sort((a, b) => {
        const aLower = a[0].toLowerCase();
        const bLower = b[0].toLowerCase();
        
        // Si a est "maison", il vient en premier
        if (aLower === 'maison') return -1;
        if (bLower === 'maison') return 1;
        
        // Si a est "villa", il vient en second (après maison)
        if (aLower === 'villa') return -1;
        if (bLower === 'villa') return 1;
        
        // Sinon tri alphabétique
        return a[0].localeCompare(b[0]);
      })
      .map(([value, count]) => ({ value, count }));

    const validSubTypes = new Set(this.subTypeOptions.map(option => option.value));
    this.selectedSubTypes = this.selectedSubTypes.filter(value => validSubTypes.has(value));
  }

  updateConditionOptions(properties: Property[]): void {
    const counts = new Map<string, number>();
    properties.forEach(property => {
      const condition = property.ConditionName?.trim();
      if (condition) {
        counts.set(condition, (counts.get(condition) || 0) + 1);
      }
    });

    this.conditionOptions = Array.from(counts.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([value, count]) => ({ value, count }));

    const validConditions = new Set(this.conditionOptions.map(option => option.value));
    this.selectedConditions = this.selectedConditions.filter(value => validConditions.has(value));
  }

  updatePriceSuggestions(properties: Property[]) {
    const filteredProperties = this.applyBaseFilters(properties, ['price']);
    if (filteredProperties.length > 0) {
      const prices = filteredProperties.map(p => p.Price).sort((a, b) => a - b);
      this.suggestedMinPrice = prices[0];
      this.suggestedMaxPrice = prices[prices.length - 1];
    } else {
      this.suggestedMinPrice = null;
      this.suggestedMaxPrice = null;
    }
  }

  selectType(typeId: string) {
    // Disable all types
    this.types.forEach(type => {
      type.active = false;
    });
    // Enable the selected type
    const selectedType = this.types.find(type => type.id === typeId);
    if (selectedType) {
      selectedType.active = true;
    }

    // Update available zips and smart filters when goal changes
    const currentProperties = this.searchService.getCurrentProperties();

    if (currentProperties.length > 0) {
      // Use timeout to debounce rapid successive calls
      setTimeout(() => {
        this.updateAvailableZips(currentProperties);
        this.checkSelectedLocationAvailability();
      }, 50);
    }

    this.onSearch();
  }

  toggleLocationDropdown() {
    this.isLocationDropdownOpen = !this.isLocationDropdownOpen;
    if (this.isLocationDropdownOpen) {
      this.filterZips('');
    }
  }

  closeLocationDropdown() {
    this.isLocationDropdownOpen = false;
  }

  onLocationInput(event: any) {
    const value = event.target.value;
    this.filterZips(value);
    if (!this.isLocationDropdownOpen) {
      this.isLocationDropdownOpen = true;
    }
  }

  filterZips(searchTerm: string) {
    let filteredZipList: ZipOption[];

    if (!searchTerm.trim()) {
      filteredZipList = [...this.availableZips];
    } else {
      const term = searchTerm.toUpperCase();
      filteredZipList = this.availableZips.filter(zip =>
        zip.localite.includes(term) ||
        zip.zip.toString().includes(term)
      );
    }

    this.filteredZips = filteredZipList;

    // Group by provinces
    this.groupZipsByProvince(filteredZipList);
  }

  groupZipsByProvince(zipList: ZipOption[]) {
    const provinceMap = new Map<string, ZipOption[]>();
    const priorityZips = [1410, 1420, 1380, 1640, 1180];

    zipList.forEach(zip => {
      const province = this.getProvinceFromZip(zip.zip);
      if (!provinceMap.has(province)) {
        provinceMap.set(province, []);
      }
      provinceMap.get(province)!.push(zip);
    });

    // Convert to array and sort provinces avec Brabant Wallon en premier
    this.filteredProvinces = [];
    const provinceOrder = ['Brabant Wallon', 'Bruxelles-Capitale', 'Brabant Flamand'];
    const allProvinces = Array.from(provinceMap.keys());
    
    // Trier les provinces : Brabant Wallon en premier, puis ordre personnalisé, puis alphabétique
    const sortedProvinces = allProvinces.sort((a, b) => {
      const aIndex = provinceOrder.indexOf(a);
      const bIndex = provinceOrder.indexOf(b);
      
      // Si les deux sont dans l'ordre prioritaire
      if (aIndex !== -1 && bIndex !== -1) {
        return aIndex - bIndex;
      }
      
      // Si seulement a est prioritaire
      if (aIndex !== -1) return -1;
      
      // Si seulement b est prioritaire
      if (bIndex !== -1) return 1;
      
      // Sinon tri alphabétique
      return a.localeCompare(b);
    });

    sortedProvinces.forEach(province => {
      const zipOptions = provinceMap.get(province)!;
      // Sort zip options within province: priority zips first, then by localite
      zipOptions.sort((a, b) => {
        const aIsPriority = priorityZips.includes(a.zip);
        const bIsPriority = priorityZips.includes(b.zip);
        
        // Si les deux sont prioritaires, respecter l'ordre de priorité
        if (aIsPriority && bIsPriority) {
          return priorityZips.indexOf(a.zip) - priorityZips.indexOf(b.zip);
        }
        
        // Les prioritaires en premier
        if (aIsPriority) return -1;
        if (bIsPriority) return 1;
        
        // Pour les autres, tri alphabétique par localité
        return a.localite.localeCompare(b.localite);
      });

      this.filteredProvinces.push({
        province: province,
        zipOptions: zipOptions
      });
    });
  }

  onPropertyTypeChange() {
    // Update smart filters when property type changes
    const currentProperties = this.searchService.getCurrentProperties();
    if (currentProperties.length > 0) {
      this.updateSmartFilters(currentProperties);
    }

    this.onSearch();
  }

  // Toggle property type dropdown
  togglePropertyTypeDropdown() {
    this.isPropertyTypeDropdownOpen = !this.isPropertyTypeDropdownOpen;
  }

  // Close property type dropdown
  closePropertyTypeDropdown() {
    this.isPropertyTypeDropdownOpen = false;
  }

  // Check if a property type is selected
  isPropertyTypeSelected(typeId: number): boolean {
    return this.selectedPropertyTypes.includes(typeId);
  }

  // Toggle property type selection
  togglePropertyTypeSelection(typeId: number) {
    const index = this.selectedPropertyTypes.indexOf(typeId);
    if (index > -1) {
      this.selectedPropertyTypes.splice(index, 1);
    } else {
      this.selectedPropertyTypes.push(typeId);
    }

    // Update smart filters when property type changes
    const currentProperties = this.searchService.getCurrentProperties();
    if (currentProperties.length > 0) {
      this.updateSmartFilters(currentProperties);
    }

    this.onSearch();
  }

  // Remove a specific property type from selection
  removePropertyType(typeId: number): void {
    this.selectedPropertyTypes = this.selectedPropertyTypes.filter(id => id !== typeId);
    
    // Update smart filters when property type changes
    const currentProperties = this.searchService.getCurrentProperties();
    if (currentProperties.length > 0) {
      this.updateSmartFilters(currentProperties);
    }
    
    this.onSearch();
  }

  // Get display text for selected property types
  getSelectedPropertyTypesText(): string {
    if (this.selectedPropertyTypes.length === 0) {
      return this.translate.instant('search.9');
    } else if (this.selectedPropertyTypes.length === 1) {
      const type = this.propertyTypes.find(t => t.id === this.selectedPropertyTypes[0]);
      return type ? this.translate.instant(type.name) : '';
    } else {
      return `${this.selectedPropertyTypes.length} types sélectionnés`;
    }
  }

  // Get property type name by id
  getPropertyTypeName(typeId: number): string {
    const type = this.propertyTypes.find(t => t.id === typeId);
    return type ? this.translate.instant(type.name) : '';
  }

  // Gestion des sous-types
  toggleSubTypeDropdown() {
    this.isSubTypeDropdownOpen = !this.isSubTypeDropdownOpen;
  }

  closeSubTypeDropdown() {
    this.isSubTypeDropdownOpen = false;
  }

  isSubTypeSelected(value: string): boolean {
    return this.selectedSubTypes.includes(value);
  }

  toggleSubTypeSelection(value: string) {
    if (this.isSubTypeSelected(value)) {
      this.selectedSubTypes = this.selectedSubTypes.filter(item => item !== value);
    } else {
      this.selectedSubTypes.push(value);
    }
    this.onSearch();
  }

  removeSubType(value: string) {
    this.selectedSubTypes = this.selectedSubTypes.filter(item => item !== value);
    this.onSearch();
  }

  getSelectedSubTypesText(): string {
    if (this.selectedSubTypes.length === 0) {
      return this.translate.instant('search.26');
    }
    if (this.selectedSubTypes.length === 1) {
      return this.selectedSubTypes[0];
    }
    return `${this.selectedSubTypes.length} ${this.translate.instant('search.13')}`;
  }

  // Gestion des états
  toggleConditionDropdown() {
    this.isConditionDropdownOpen = !this.isConditionDropdownOpen;
  }

  closeConditionDropdown() {
    this.isConditionDropdownOpen = false;
  }

  isConditionSelected(value: string): boolean {
    return this.selectedConditions.includes(value);
  }

  toggleConditionSelection(value: string) {
    if (this.isConditionSelected(value)) {
      this.selectedConditions = this.selectedConditions.filter(item => item !== value);
    } else {
      this.selectedConditions.push(value);
    }
    this.onSearch();
  }

  removeCondition(value: string) {
    this.selectedConditions = this.selectedConditions.filter(item => item !== value);
    this.onSearch();
  }

  getSelectedConditionsText(): string {
    if (this.selectedConditions.length === 0) {
      return this.translate.instant('search.28');
    }
    if (this.selectedConditions.length === 1) {
      return this.selectedConditions[0];
    }
    return `${this.selectedConditions.length} ${this.translate.instant('search.13')}`;
  }

  selectZip(zipOption: ZipOption) {
    // Use the new toggle method for multi-selection
    this.toggleLocationSelection(zipOption);
  }

  togglePriceDropdown() {
    this.isPriceDropdownOpen = !this.isPriceDropdownOpen;
  }

  closePriceDropdown() {
    this.isPriceDropdownOpen = false;
    // Sync form values with component properties
    this.minPrice = this.searchForm.get('minPrice')?.value;
    this.maxPrice = this.searchForm.get('maxPrice')?.value;

    // Update available zips and smart filters with new price criteria
    const currentProperties = this.searchService.getCurrentProperties();
    if (currentProperties.length > 0) {
      setTimeout(() => {
        this.updateAvailableZips(currentProperties);
        this.checkSelectedLocationAvailability();
      }, 50);
    }

    this.onSearch();
  }

  getPriceDisplayText(): string {
    if (this.minPrice && this.maxPrice) {
      return `${this.minPrice}€ - ${this.maxPrice}€`;
    } else if (this.minPrice) {
      return `${this.translate.instant('search.19')} ${this.minPrice}€`;
    } else if (this.maxPrice) {
      return `${this.translate.instant('search.20')} ${this.maxPrice}€`;
    }
    return this.translate.instant('search.14');
  }

  toggleRoomsDropdown() {
    this.isRoomsDropdownOpen = !this.isRoomsDropdownOpen;
  }

  closeRoomsDropdown() {
    this.isRoomsDropdownOpen = false;

    // Update available zips and smart filters with new room criteria
    const currentProperties = this.searchService.getCurrentProperties();
    if (currentProperties.length > 0) {
      setTimeout(() => {
        this.updateAvailableZips(currentProperties);
        this.checkSelectedLocationAvailability();
      }, 50);
    }

    this.onSearch();
  }

  getRoomsDisplayText(): string {
    if (this.selectedRooms.length === 0) {
      return this.translate.instant('search.10');
    } else if (this.selectedRooms.length === 1) {
      // Try to find in available rooms first, fallback to all rooms
      let room = this.availableRoomOptions.find(r => r.value === this.selectedRooms[0]);
      if (!room) {
        room = this.allRoomOptions.find(r => r.value === this.selectedRooms[0]);
      }
      const chambreText = this.selectedRooms[0] > 1 ? this.translate.instant('search.12') : this.translate.instant('search.11');
      return `${room?.label} ${chambreText}`;
    } else {
      return `${this.selectedRooms.length} ${this.translate.instant('search.13')}`;
    }
  }

  toggleRoomSelection(roomValue: number) {
    const index = this.selectedRooms.indexOf(roomValue);
    if (index > -1) {
      this.selectedRooms.splice(index, 1);
    } else {
      this.selectedRooms.push(roomValue);
    }

    // Update available zips and smart filters immediately when room selection changes
    const currentProperties = this.searchService.getCurrentProperties();
    if (currentProperties.length > 0) {
      setTimeout(() => {
        this.updateAvailableZips(currentProperties);
        this.checkSelectedLocationAvailability();
      }, 50);
    }

    this.onSearch();
  }

  isRoomSelected(roomValue: number): boolean {
    return this.selectedRooms.includes(roomValue);
  }

  // Search function
  onSearch() {
    const minPriceValue = this.searchForm.get('minPrice')?.value;
    const maxPriceValue = this.searchForm.get('maxPrice')?.value;
    const minSurfaceValue = this.searchForm.get('minSurface')?.value;
    const maxSurfaceValue = this.searchForm.get('maxSurface')?.value;
    const minGardenSurfaceValue = this.searchForm.get('minGardenSurface')?.value;
    const maxGardenSurfaceValue = this.searchForm.get('maxGardenSurface')?.value;
    const minGarageCountValue = this.searchForm.get('minGarageCount')?.value;
    const showWithTerraceValue = this.searchForm.get('showWithTerrace')?.value;
    const showWithGardenValue = this.searchForm.get('showWithGarden')?.value;

    // Sync component properties with form values
    this.minPrice = minPriceValue || null;
    this.maxPrice = maxPriceValue || null;
    this.minSurface = minSurfaceValue || null;
    this.maxSurface = maxSurfaceValue || null;
    this.minGardenSurface = minGardenSurfaceValue || null;
    this.maxGardenSurface = maxGardenSurfaceValue || null;
    this.minGarageCount = minGarageCountValue || null;
    this.showWithTerrace = showWithTerraceValue || false;
    this.showWithGarden = showWithGardenValue || false;

    // Get selected goal (Achat=0, Location=1)
    const selectedGoal = this.getSelectedGoal();

    // Convert selected locations to zip codes
    const zipCodes = this.getZipCodesFromSelectedLocations();

    // Get selected property types (multi-sélection)
    const propertyTypes = this.selectedPropertyTypes;

    const criteria: SearchCriteria = {
      goal: selectedGoal,
      location: this.selectedLocations.join(', '), // Store as comma-separated string
      propertyTypes: propertyTypes,
      zipCodes: zipCodes,
      selectedRooms: this.selectedRooms,
      minPrice: this.minPrice,
      maxPrice: this.maxPrice,
      // Nouveaux filtres avancés
      showWithTerrace: this.showWithTerrace,
      showWithGarden: this.showWithGarden,
      minSurface: this.minSurface,
      maxSurface: this.maxSurface,
      subTypes: this.selectedSubTypes,
      propertyConditions: this.selectedConditions,
      minGardenSurface: this.minGardenSurface,
      maxGardenSurface: this.maxGardenSurface,
      minGarageCount: this.minGarageCount
    };

    this.searchService.updateSearchCriteria(criteria);
  }

  // Search function with scroll to results (mobile/tablet only)
  onSearchAndScroll() {
    // First perform the search
    this.onSearch();

    // Then scroll to the results section after a short delay
    setTimeout(() => {
      // Try to find the results container (our-biens component or results section)
      const resultsElement =
        document.querySelector('[id*="listProperty"]');
      console.log(resultsElement);

      if (resultsElement) {
        // Get element position and add some offset for better visibility
        const elementRect = resultsElement.getBoundingClientRect();
        const absoluteElementTop = elementRect.top + window.pageYOffset;
        const offset = 100; // Add 100px offset from top

        window.scrollTo({
          top: absoluteElementTop - offset,
          behavior: 'smooth'
        });
      } else {
        // Fallback: scroll down by a larger amount
        window.scrollBy({
          top: 600,
          behavior: 'smooth'
        });
      }
    }, 300); // Small delay to ensure search results are updated
  }

  // Get zip codes from all selected locations
  getZipCodesFromSelectedLocations(): number[] {
    const allZips: number[] = [];
    this.selectedLocations.forEach(location => {
      const zips = this.getZipCodesFromLocation(location);
      allZips.push(...zips);
    });
    return [...new Set(allZips)]; // Remove duplicates
  }

  // Get display text for selected locations
  getSelectedLocationsText(): string {
    if (this.selectedLocations.length === 0) {
      return this.translate.instant('search.6');
    } else if (this.selectedLocations.length === 1) {
      return this.selectedLocations[0];
    } else {
      return `${this.selectedLocations.length} ${this.translate.instant('search.24')}`;
    }
  }

  // Get short name for location chip (just city name without zip)
  getLocationShortName(location: string): string {
    // Extract format "1410 WATERLOO" from "1410 WATERLOO"
    const match = location.match(/^(\d{4})\s+(.+)$/);
    if (match) {
      return `${match[1]} ${match[2]}`;
    }
    return location;
  }

  // Remove a specific location from selection
  removeLocation(location: string): void {
    this.selectedLocations = this.selectedLocations.filter(loc => loc !== location);
    // Garder le champ vide
    this.searchForm.get('location')?.setValue('', { emitEvent: false });
    
    // Update smart filters when location changes
    const currentProperties = this.searchService.getCurrentProperties();
    if (currentProperties.length > 0) {
      this.updateSmartFilters(currentProperties);
    }
    
    this.onSearch();
  }

  // Check if a location is selected
  isLocationSelected(locationText: string): boolean {
    return this.selectedLocations.includes(locationText);
  }

  // Toggle location selection
  toggleLocationSelection(zipOption: ZipOption) {
    const locationText = zipOption.displayText;
    if (this.isLocationSelected(locationText)) {
      // Remove from selection
      this.selectedLocations = this.selectedLocations.filter(loc => loc !== locationText);
    } else {
      // Add to selection
      this.selectedLocations.push(locationText);
    }

    // Fermer le dropdown
    this.closeLocationDropdown();

    // Vider le champ input complètement (les chips suffisent)
    this.searchForm.get('location')?.setValue('', { emitEvent: false });

    // Update smart filters when location changes
    const currentProperties = this.searchService.getCurrentProperties();
    if (currentProperties.length > 0) {
      this.updateSmartFilters(currentProperties);
    }

    this.onSearch();
  }

  // Convert location input to zip codes
  private getZipCodesFromLocation(location: string): number[] {
    if (!location.trim()) return [];

    // Check if it's a selected zip option (format: "1410 WATERLOO (4)")
    const zipMatch = location.match(/^(\d{4})\s/);
    if (zipMatch) {
      return [Number(zipMatch[1])];
    }

    // Otherwise search in zip codes and city names
    const searchTerm = location.toUpperCase();
    const matchingZips: number[] = [];

    this.listOfZips.forEach(item => {
      if (item.localite.includes(searchTerm) ||
        item.zip.toString().includes(searchTerm)) {
        matchingZips.push(Number(item.zip));
      }
    });

    return matchingZips;
  }

  // Restauration des critères de recherche depuis le service
  private restoreSearchCriteria(criteria: SearchCriteria): void {
    // Restauration du goal (Achat/Location)
    this.types.forEach(type => type.active = false);
    const targetTypeId = criteria.goal === 0 ? 'sale' : 'rental';
    const targetType = this.types.find(type => type.id === targetTypeId);
    if (targetType) {
      targetType.active = true;
    }

    // Restauration de la localisation
    if (criteria.location) {
      this.selectedLocations = criteria.location.split(', ').filter(loc => loc.trim());
      // NE PAS écrire dans le form control - les chips suffisent
    } else {
      this.selectedLocations = [];
    }

    // Restauration des types de propriété (multi-sélection)
    this.selectedPropertyTypes = criteria.propertyTypes || [];

    // Restauration des chambres
    this.selectedRooms = criteria.selectedRooms || [];
    this.selectedSubTypes = criteria.subTypes || [];
    this.selectedConditions = criteria.propertyConditions || [];

    // Restauration des prix
    this.minPrice = criteria.minPrice;
    this.maxPrice = criteria.maxPrice;
    this.searchForm.get('minPrice')?.setValue(criteria.minPrice);
    this.searchForm.get('maxPrice')?.setValue(criteria.maxPrice);

    // Restauration des filtres avancés (correction du bug de re-cochage automatique)
    this.showWithTerrace = criteria.showWithTerrace || false;
    this.showWithGarden = criteria.showWithGarden || false;
    this.minSurface = criteria.minSurface;
    this.maxSurface = criteria.maxSurface;
    this.minGardenSurface = criteria.minGardenSurface ?? null;
    this.maxGardenSurface = criteria.maxGardenSurface ?? null;
    this.minGarageCount = criteria.minGarageCount ?? null;
    
    // Mise à jour des contrôles de formulaire
    this.searchForm.get('minSurface')?.setValue(criteria.minSurface);
    this.searchForm.get('maxSurface')?.setValue(criteria.maxSurface);
    this.searchForm.get('showWithTerrace')?.setValue(this.showWithTerrace);
    this.searchForm.get('showWithGarden')?.setValue(this.showWithGarden);
    this.searchForm.get('minGardenSurface')?.setValue(this.minGardenSurface);
    this.searchForm.get('maxGardenSurface')?.setValue(this.maxGardenSurface);
    this.searchForm.get('minGarageCount')?.setValue(this.minGarageCount);

    // Mise à jour des codes postaux disponibles avec les critères restaurés
    const currentProperties = this.searchService.getCurrentProperties();
    if (currentProperties.length > 0) {
      this.updateAvailableZips(currentProperties);
      this.checkSelectedLocationAvailability();
    }
  }

  // Check if selected locations are still available after type change
  checkSelectedLocationAvailability() {
    const stillAvailableLocations: string[] = [];

    this.selectedLocations.forEach(selectedLocation => {
      if (selectedLocation && selectedLocation.trim()) {
        // Extract zip code from selected location (format: "1410 WATERLOO"
        const zipMatch = selectedLocation.match(/^(\d{4})\s/);
        if (zipMatch) {
          const selectedZip = Number(zipMatch[1]);

          const isStillAvailable = this.availableZips.some(zip => zip.zip === selectedZip);

          if (isStillAvailable) {
            // Update the count display
            const updatedZip = this.availableZips.find(zip => zip.zip === selectedZip);
            if (updatedZip) {
              stillAvailableLocations.push(updatedZip.displayText);
            }
          }
        }
      }
    });

    // Update selections with only available locations
    this.selectedLocations = stillAvailableLocations;
    // NE PAS écrire dans le form control - les chips suffisent
  }

  // Méthodes pour les filtres avancés
  toggleAdvancedFilters() {
    this.isAdvancedFiltersOpen = !this.isAdvancedFiltersOpen;
  }

  toggleSurfaceDropdown() {
    this.isSurfaceDropdownOpen = !this.isSurfaceDropdownOpen;
  }

  closeSurfaceDropdown() {
    this.isSurfaceDropdownOpen = false;
    // Sync form values with component properties
    this.minSurface = this.searchForm.get('minSurface')?.value || null;
    this.maxSurface = this.searchForm.get('maxSurface')?.value || null;
    
    // Update available zips and smart filters with new surface criteria
    const currentProperties = this.searchService.getCurrentProperties();
    if (currentProperties.length > 0) {
      this.updateAvailableZips(currentProperties);
      this.checkSelectedLocationAvailability();
    }
    
    this.onSearch();
  }

  getSurfaceDisplayText(): string {
    if (this.minSurface && this.maxSurface) {
      return `${this.minSurface}m² - ${this.maxSurface}m²`;
    } else if (this.minSurface) {
      return `À partir de ${this.minSurface}m²`;
    } else if (this.maxSurface) {
      return `Jusqu'à ${this.maxSurface}m²`;
    }
    return this.translate.instant('search.29');
  }

  toggleGardenSurfaceDropdown() {
    this.isGardenSurfaceDropdownOpen = !this.isGardenSurfaceDropdownOpen;
  }

  closeGardenSurfaceDropdown() {
    this.isGardenSurfaceDropdownOpen = false;
    this.minGardenSurface = this.searchForm.get('minGardenSurface')?.value || null;
    this.maxGardenSurface = this.searchForm.get('maxGardenSurface')?.value || null;

    const currentProperties = this.searchService.getCurrentProperties();
    if (currentProperties.length > 0) {
      this.updateAvailableZips(currentProperties);
      this.checkSelectedLocationAvailability();
    }

    this.onSearch();
  }

  getGardenSurfaceDisplayText(): string {
    if (this.minGardenSurface && this.maxGardenSurface) {
      return `${this.minGardenSurface}m² - ${this.maxGardenSurface}m²`;
    } else if (this.minGardenSurface) {
      return `≥ ${this.minGardenSurface}m²`;
    } else if (this.maxGardenSurface) {
      return `≤ ${this.maxGardenSurface}m²`;
    }
    return this.translate.instant('search.30');
  }

  toggleGarageDropdown() {
    this.isGarageDropdownOpen = !this.isGarageDropdownOpen;
  }

  closeGarageDropdown() {
    this.isGarageDropdownOpen = false;
  }

  selectGarageOption(value: number | null) {
    this.minGarageCount = value;
    this.searchForm.get('minGarageCount')?.setValue(value);
    this.closeGarageDropdown();

    const currentProperties = this.searchService.getCurrentProperties();
    if (currentProperties.length > 0) {
      this.updateAvailableZips(currentProperties);
      this.checkSelectedLocationAvailability();
    }

    this.onSearch();
  }

  getGarageDisplayText(): string {
    if (this.minGarageCount) {
      return `${this.minGarageCount}+ ${this.translate.instant('search.35')}`;
    }
    return this.translate.instant('search.31');
  }

  onAdvancedFilterChange(): void {
    // Synchronisation des valeurs du formulaire avec les propriétés du composant
    this.showWithTerrace = this.searchForm.get('showWithTerrace')?.value || false;
    this.showWithGarden = this.searchForm.get('showWithGarden')?.value || false;
    
    // Mise à jour des codes postaux et filtres intelligents
    const currentProperties = this.searchService.getCurrentProperties();
    if (currentProperties.length > 0) {
      this.updateAvailableZips(currentProperties);
      this.checkSelectedLocationAvailability();
    }
    
    this.onSearch();
  }

  // Clear search
  clearSearch(): void {
    this.searchForm.reset();
    this.selectedLocations = [];
    this.selectedPropertyTypes = [];
    this.minPrice = null;
    this.maxPrice = null;
    this.selectedRooms = [];
    this.selectedSubTypes = [];
    this.selectedConditions = [];
    
    // Réinitialisation des filtres avancés
    this.showWithTerrace = false;
    this.showWithGarden = false;
    this.minSurface = null;
    this.maxSurface = null;
    this.minGardenSurface = null;
    this.maxGardenSurface = null;
    this.minGarageCount = null;
    
    // Réinitialisation des contrôles de formulaire
    this.searchForm.get('showWithTerrace')?.setValue(false);
    this.searchForm.get('showWithGarden')?.setValue(false);
    this.searchForm.get('minSurface')?.setValue(null);
    this.searchForm.get('maxSurface')?.setValue(null);
    this.searchForm.get('minGardenSurface')?.setValue(null);
    this.searchForm.get('maxGardenSurface')?.setValue(null);
    this.searchForm.get('minGarageCount')?.setValue(null);
    
    // Retour à l'état par défaut (vente/achat)
    this.types.forEach(type => type.active = false);
    this.types[0].active = true; // Premier type = "sale"
    
    this.searchService.clearSearch();
  }
}
