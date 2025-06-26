import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent implements OnInit {

  constructor() { }

  types = [
    { id: 0, name: 'Achat', active: true },
    { id: 1, name: 'Location', active: false }
  ]

  isPriceDropdownOpen = false;
  minPrice: number | null = null;
  maxPrice: number | null = null;

  isRoomsDropdownOpen = false;
  minRooms: number | null = null;
  maxRooms: number | null = null;

  ngOnInit(): void {
  }

  searchForm = new FormGroup({
    search: new FormControl(''),
    minPrice: new FormControl(null),
    maxPrice: new FormControl(null)
  })


  selectType(index: number) {
    //disable all types
    this.types.forEach(type => {
      type.active = false;
    });
    //enable the selected type
    this.types[index].active = true;
  }

  togglePriceDropdown() {
    this.isPriceDropdownOpen = !this.isPriceDropdownOpen;
  }

  closePriceDropdown() {
    this.isPriceDropdownOpen = false;
  }

  getPriceDisplayText(): string {
    if (this.minPrice && this.maxPrice) {
      return `${this.minPrice}€ - ${this.maxPrice}€`;
    } else if (this.minPrice) {
      return `À partir de ${this.minPrice}€`;
    } else if (this.maxPrice) {
      return `Jusqu'à ${this.maxPrice}€`;
    }
    return 'Prix';
  }

  toggleRoomsDropdown() {
    this.isRoomsDropdownOpen = !this.isRoomsDropdownOpen;
  }

  closeRoomsDropdown() {
    this.isRoomsDropdownOpen = false;
  }

  getRoomsDisplayText(): string {
    if (this.minRooms && this.maxRooms) {
      return `${this.minRooms} - ${this.maxRooms} chambres`;
    } else if (this.minRooms) {
      return `À partir de ${this.minRooms} chambre${this.minRooms > 1 ? 's' : ''}`;
    } else if (this.maxRooms) {
      return `Jusqu'à ${this.maxRooms} chambre${this.maxRooms > 1 ? 's' : ''}`;
    }
    return 'Nombre de chambres';
  }
}
