import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

import { Options } from "@angular-slider/ngx-slider";
import { OmnicasaService } from '../services/omnicasa/omnicasa.service'
import { FirestoreService } from '../services/firebase/firestore.service';
import { Property } from '../services/omnicasa/interface';


interface SliderDetails {
  minValue: number;
  highValue: number;
  options: Options;
}



@Component({
  selector: 'app-our-biens',
  templateUrl: './our-biens.component.html',
  styleUrls: ['./our-biens.component.css']
})
export class OurBiensComponent implements OnInit {

  numberProperty = 9;


  addProperties() {
    this.numberProperty = this.numberProperty + 6;
  }


  registerForm = new FormGroup({
    selected: new FormControl('', [Validators.required]),
    zip: new FormControl('', [Validators.required])
  });

  cityZip;
  submitted = false;
  goalSelect = false;
  selectedTypes = [];
  goal;
  search: any[];
  toShow: Property[];
  toSearch: Property[];
  types: any;
  items: any;



  constructor(public firestore: FirestoreService) { }

  ngOnInit(): void {
    this.types = [
      { id: 1, name: 'Maison' },
      { id: 2, name: 'Appartement' },
      { id: 3, name: 'Studio' },
      { id: 4, name: 'Terrain' },
      { id: 5, name: 'Immeubles' },
      { id: 6, name: 'Bureaux/Commerces' },
      { id: 7, name: 'Garage/Parking' },
    ];

    this.items = [
      { name: 'Acheter', select: false },
      { name: 'Louer', select: false }
    ];

    this.firestore.getFirestoreCollection('activeProperties').subscribe(data =>
      this.toShow = data.map(e => {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data() as Property
        }
      }));
    this.firestore.getFirestoreCollection('activeProperties').subscribe(data =>
      this.toSearch = data.map(e => {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data() as Property
        }
      }));
  }

  

  

  get f() { return this.registerForm.controls; }

  onSubmit() {
    this.submitted = true;
    this.selectedTypes = this.registerForm.value.selected;
    this.cityZip = this.registerForm.value.zip;
    this.toShow = this.searchProperty(this.goal, 2, this.selectedTypes, this.cityZip, this.sliderRooms.minValue, this.sliderRooms.highValue, this.sliderBudget.minValue, this.sliderBudget.highValue);
  }

  onReset() {
    this.submitted = false;
    this.registerForm.reset();
  }

  toggleClass(item) {
    this.items[0].select = false;
    this.items[1].select = false;
    item.select = !item.select;
    if (this.items[0].select) {
      this.goal = 0;
    }
    else {
      this.goal = 1;
    }
    this.goalSelect = true;
  }

  searchProperty(goal: number, status: number, type: number[], zip: number, minRoom: number, maxRoom: number, minPrice: number, maxPrice: number) {
    var toReturn: Property[];
    toReturn = [];
    for (let i = this.toSearch.length - 1; i >= 0; i--) {
      if (this.toSearch[i].Goal == goal && this.toSearch[i].SubStatus == status) {
        for (let j = 0; j < type.length; j++) {
          if (type[j] == this.toSearch[i].WebID) {
            if (this.toSearch[i].Zip == zip) {
              if (this.toSearch[i].NumberOfBedRooms) {
                if (this.toSearch[i].NumberOfBedRooms >= minRoom && this.toSearch[i].NumberOfBedRooms <= maxRoom) {
                  if (this.toSearch[i].Price >= minPrice && this.toSearch[i].Price <= maxPrice) {
                    toReturn.push(this.toSearch[i]);
                  }
                }
              }
              else if (this.toSearch[i].Price >= minPrice && this.toSearch[i].Price <= maxPrice) {
                toReturn.push(this.toSearch[i]);
              }
            }
          }
        }
      }
    }
    console.log
    return toReturn;
  }

  sliderRooms: SliderDetails =
    {
      minValue: 0,
      highValue: 10,
      options: {
        floor: 0,
        ceil: 10,
        step: 1,
      }
    }

  sliderBudget: SliderDetails =
    {
      minValue: 0,
      highValue: 2000000,
      options: {
        floor: 0,
        ceil: 2000000,
        step: 10000,
        translate: (value: number): string => {
          if(value==2000000){
            return "+" + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " €";
          }
            return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " €";
        }
      }
    }

  lowerThan(one: number, two: number) {
    return one < two;
  }

  get selected() { return this.registerForm.get('selected'); }
  get zip() { return this.registerForm.get('zip'); }



}
