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

  isLocationDropdownOpen = false;
  selectedLocations: string[] = [];

  // Form controls
  searchForm = new FormGroup({
    location: new FormControl(''),
    propertyType: new FormControl(''),
    minPrice: new FormControl(null),
    maxPrice: new FormControl(null)
  })

  ngOnInit(): void {
    // Subscribe to all properties to calculate zip counts
    this.searchService.allProperties$.subscribe(properties => {
      this.updateAvailableZips(properties);
    });

    // Restore current search criteria if they exist (for navigation between pages)
    const currentCriteria = this.searchService.getCurrentCriteria();
    if (currentCriteria) {
      this.restoreSearchCriteria(currentCriteria);
    }
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

  updateAvailableZips(properties: Property[]) {
    // Get current goal (Achat=0, Location=1)
    const selectedGoal = this.getSelectedGoal();

    // Filter properties by ALL current criteria (except location to avoid circular dependency)
    const filteredProperties = properties.filter(property => {
      // Basic filters
      if (property.SubStatus !== 2 && property.SubStatus !== 3) return false;
      if (property.Goal !== selectedGoal) return false;

      // Room filter
      if (this.selectedRooms.length > 0) {
        let matchesRoom = false;
        for (const selectedRoom of this.selectedRooms) {
          if (selectedRoom === 5) { // "4+" chambres
            if (property.NumberOfBedRooms >= 4) matchesRoom = true;
          } else {
            if (property.NumberOfBedRooms === selectedRoom) matchesRoom = true;
          }
        }
        if (!matchesRoom) return false;
      }

      // Price filter
      if (this.minPrice && property.Price < this.minPrice) return false;
      if (this.maxPrice && property.Price > this.maxPrice) return false;

      return true;
    });

    // Count properties by zip code
    const zipCounts = new Map<number, number>();
    filteredProperties.forEach(property => {
      const zipNumber = Number(property.Zip);
      const count = zipCounts.get(zipNumber) || 0;
      zipCounts.set(zipNumber, count + 1);
    });

    // Create available zips with counts
    this.availableZips = [];
    zipCounts.forEach((count, zip) => {
      // Only add zips that have properties
      if (count > 0) {
        const zipInfo = this.listOfZips.find(item => item.zip === zip);
        if (zipInfo) {
          this.availableZips.push({
            zip: zip,
            localite: zipInfo.localite,
            count: count,
            displayText: `${zip} ${zipInfo.localite} (${count})`
          });
        }
      }
    });

    // Sort by localite name
    this.availableZips.sort((a, b) => a.localite.localeCompare(b.localite));
    this.filteredZips = [...this.availableZips];

    // Group by provinces
    this.groupZipsByProvince(this.availableZips);

    // Update smart filters (property types, rooms, price suggestions)
    this.updateSmartFilters(properties);
  }

  updateSmartFilters(properties: Property[]) {
    // Get current criteria (excluding what we're calculating)
    const selectedGoal = this.getSelectedGoal();
    const selectedLocationZips = this.getZipCodesFromSelectedLocations();

    // Base filter: goal, status, location
    const baseFilteredProperties = properties.filter(property => {
      if (property.SubStatus !== 2 && property.SubStatus !== 3) return false;
      if (property.Goal !== selectedGoal) return false;

      // Location filter
      if (selectedLocationZips.length > 0) {
        const propertyZip = Number(property.Zip);
        if (!selectedLocationZips.includes(propertyZip)) return false;
      }

      return true;
    });

    // Update property types counts
    this.updatePropertyTypeCounts(baseFilteredProperties);

    // Update available rooms
    this.updateAvailableRooms(baseFilteredProperties);

    // Update price suggestions
    this.updatePriceSuggestions(baseFilteredProperties);
  }

  updatePropertyTypeCounts(properties: Property[]) {
    // Apply current filters (except property type)
    const filteredProperties = properties.filter(property => {
      // Room filter
      if (this.selectedRooms.length > 0) {
        let matchesRoom = false;
        for (const selectedRoom of this.selectedRooms) {
          if (selectedRoom === 5) { // "4+" chambres
            if (property.NumberOfBedRooms >= 4) matchesRoom = true;
          } else {
            if (property.NumberOfBedRooms === selectedRoom) matchesRoom = true;
          }
        }
        if (!matchesRoom) return false;
      }

      // Price filter
      if (this.minPrice && property.Price < this.minPrice) return false;
      if (this.maxPrice && property.Price > this.maxPrice) return false;

      return true;
    });

    // Count by property type
    this.propertyTypes.forEach(propertyType => {
      const count = filteredProperties.filter(p => p.WebID === propertyType.id).length;
      propertyType.count = count;
    });
  }

  updateAvailableRooms(properties: Property[]) {
    // Apply current filters (except rooms)
    const filteredProperties = properties.filter(property => {
      // Property type filter
      const selectedPropertyType = this.searchForm.get('propertyType')?.value;
      if (selectedPropertyType && Number(selectedPropertyType) !== property.WebID) return false;

      // Price filter
      if (this.minPrice && property.Price < this.minPrice) return false;
      if (this.maxPrice && property.Price > this.maxPrice) return false;

      return true;
    });

    // Count by rooms and only show available options
    this.availableRoomOptions = [];
    this.allRoomOptions.forEach(roomOption => {
      let count = 0;

      if (roomOption.value === 5) { // "4+" chambres
        count = filteredProperties.filter(p => p.NumberOfBedRooms >= 4).length;
      } else {
        count = filteredProperties.filter(p => p.NumberOfBedRooms === roomOption.value).length;
      }

      if (count > 0) {
        this.availableRoomOptions.push({
          ...roomOption,
          count: count
        });
      }
    });

    // Clean up selected rooms that are no longer available
    this.selectedRooms = this.selectedRooms.filter(selectedRoom =>
      this.availableRoomOptions.some(option => option.value === selectedRoom)
    );
  }

  updatePriceSuggestions(properties: Property[]) {
    // Apply current filters (except price)
    const filteredProperties = properties.filter(property => {
      // Property type filter
      const selectedPropertyType = this.searchForm.get('propertyType')?.value;
      if (selectedPropertyType && Number(selectedPropertyType) !== property.WebID) return false;

      // Room filter
      if (this.selectedRooms.length > 0) {
        let matchesRoom = false;
        for (const selectedRoom of this.selectedRooms) {
          if (selectedRoom === 5) { // "4+" chambres
            if (property.NumberOfBedRooms >= 4) matchesRoom = true;
          } else {
            if (property.NumberOfBedRooms === selectedRoom) matchesRoom = true;
          }
        }
        if (!matchesRoom) return false;
      }

      return true;
    });

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

    zipList.forEach(zip => {
      const province = this.getProvinceFromZip(zip.zip);
      if (!provinceMap.has(province)) {
        provinceMap.set(province, []);
      }
      provinceMap.get(province)!.push(zip);
    });

    // Convert to array and sort provinces
    this.filteredProvinces = [];
    const sortedProvinces = Array.from(provinceMap.keys()).sort();

    sortedProvinces.forEach(province => {
      const zipOptions = provinceMap.get(province)!;
      // Sort zip options within province by localite
      zipOptions.sort((a, b) => a.localite.localeCompare(b.localite));

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
    const propertyTypeValue = this.searchForm.get('propertyType')?.value;
    const minPriceValue = this.searchForm.get('minPrice')?.value;
    const maxPriceValue = this.searchForm.get('maxPrice')?.value;

    // Sync component properties with form values
    this.minPrice = minPriceValue || null;
    this.maxPrice = maxPriceValue || null;

    // Get selected goal (Achat=0, Location=1)
    const selectedGoal = this.getSelectedGoal();

    // Convert selected locations to zip codes
    const zipCodes = this.getZipCodesFromSelectedLocations();

    // Get selected property types
    const propertyTypes = propertyTypeValue ? [Number(propertyTypeValue)] : [];

    const criteria: SearchCriteria = {
      goal: selectedGoal,
      location: this.selectedLocations.join(', '), // Store as comma-separated string
      propertyTypes: propertyTypes,
      zipCodes: zipCodes,
      selectedRooms: this.selectedRooms,
      minPrice: this.minPrice,
      maxPrice: this.maxPrice
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

    // Update form control with combined locations
    this.searchForm.get('location')?.setValue(this.selectedLocations.join(', '));

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

  // Restore search criteria from service
  private restoreSearchCriteria(criteria: SearchCriteria) {
    // Restore goal (Achat/Location)
    this.types.forEach(type => type.active = false);
    // Convert goal number back to type ID (0 = sale, 1 = rental)
    const targetTypeId = criteria.goal === 0 ? 'sale' : 'rental';
    const targetType = this.types.find(type => type.id === targetTypeId);
    if (targetType) {
      targetType.active = true;
    }

    // Restore location
    if (criteria.location) {
      // Split by comma in case multiple locations were stored
      this.selectedLocations = criteria.location.split(', ').filter(loc => loc.trim());
      this.searchForm.get('location')?.setValue(criteria.location);
    } else {
      this.selectedLocations = [];
    }

    // Restore property type
    if (criteria.propertyTypes.length > 0) {
      this.searchForm.get('propertyType')?.setValue(criteria.propertyTypes[0].toString());
    }

    // Restore rooms
    this.selectedRooms = criteria.selectedRooms || [];

    // Restore price
    this.minPrice = criteria.minPrice;
    this.maxPrice = criteria.maxPrice;
    this.searchForm.get('minPrice')?.setValue(criteria.minPrice);
    this.searchForm.get('maxPrice')?.setValue(criteria.maxPrice);

    // Update available zips with restored criteria
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
        // Extract zip code from selected location (format: "1410 WATERLOO (4)")
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
    this.searchForm.get('location')?.setValue(this.selectedLocations.join(', '));
  }

  // Clear search
  clearSearch() {
    this.searchForm.reset();
    this.selectedLocations = [];
    this.minPrice = null;
    this.maxPrice = null;
    this.selectedRooms = [];
    // Reset to default state (sale)
    this.types.forEach(type => type.active = false);
    const saleType = this.types.find(type => type.id === 'sale');
    if (saleType) {
      saleType.active = true;
    }
    this.searchService.clearSearch();
  }
}
