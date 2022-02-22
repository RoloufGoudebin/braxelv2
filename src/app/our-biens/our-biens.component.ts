import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

import { Options } from "@angular-slider/ngx-slider";
import { OmnicasaService } from '../services/omnicasa/omnicasa.service'
import { FirestoreService } from '../services/firebase/firestore.service';
import { Property } from '../services/omnicasa/interface';
import { Observable, Subject } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

import data from '../json/zip.json'


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

  listOfZips = data;
  searchText = new Subject();
  results: Observable<string[]>;


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
  sell: Property[];
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

    this.listOfZips.sort(function (a: any, b: any) {
      return a.zip - b.zip;
    })

    for (let i = 0; i < this.listOfZips.length; i++) {
      this.listOfZips[i].localite = this.listOfZips[i].localite.toUpperCase();
    }

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

    this.firestore.getFirestoreCollection('sellProperties').subscribe(data =>
      this.sell = data.map(e => {
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
    this.sliderBudget.options.ceil = 20000;
    item.select = !item.select;
    if (this.items[0].select) {
      this.goal = 0;
    }
    else {
      this.goal = 1;
    }
    this.goalSelect = true;
  }

  searchProperty(goal: number, status: number, type: number[], zip: number[], minRoom: number, maxRoom: number, minPrice: number, maxPrice: number) {
    var toReturn: Property[];
    toReturn = [];
    for (let i = this.toSearch.length - 1; i >= 0; i--) {
      if (this.toSearch[i].Goal == goal && this.toSearch[i].SubStatus == status) {
        for (let j = 0; j < type.length; j++) {
          if (type[j] == this.toSearch[i].WebID) {
            for (let k = 0; k < zip.length; k++) {
              if (this.toSearch[i].Zip == zip[k]) {
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
    }
    if (toReturn.length == 0) {
      for (let i = this.sell.length - 1; i >= 0; i--) {
        if (this.sell[i].Goal == goal) {
          toReturn.push(this.sell[i]);
        }
      }
      console.log(toReturn)
    }
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
          if (value == 2000000) {
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
