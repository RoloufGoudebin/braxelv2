import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';

import { Options } from "@angular-slider/ngx-slider";
import { FirestoreService } from '../services/firebase/firestore.service';
import { Property } from '../services/omnicasa/interface';
import { Observable, Subject } from 'rxjs';
import { ViewportScroller } from '@angular/common';

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
  allProperties: Property[];
  toSearch: Property[];
  toShow: Property[];
  sell: Property[];
  types: any;
  items: any;



  constructor(public firestore: FirestoreService, private viewportScroller: ViewportScroller) { }

  ngOnInit(): void {

    this.types = [
      { id: 1, name: 'navbar.16.a' },
      { id: 2, name: 'navbar.16.b' },
      { id: 3, name: 'navbar.16.c' },
      { id: 4, name: 'navbar.16.d' },
      { id: 5, name: 'navbar.16.e' },
      { id: 6, name: 'navbar.16.f' },
      { id: 7, name: 'navbar.16.g' },
    ];

    this.items = [
      { name: 'ourBiens.2a', select: false },
      { name: 'ourBiens.2b', select: false }
    ];

    this.listOfZips.sort(function (a: any, b: any) {
      return a.zip - b.zip;
    })

    for (let i = 0; i < this.listOfZips.length; i++) {
      this.listOfZips[i].localite = this.listOfZips[i].localite.toUpperCase();
    }

    this.firestore.prout.subscribe(data => {
      this.allProperties = data.map(e => {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data() as Property
        }
      }).sort(function (a: Property, b: Property) { //un premier tri sur id (ordre des propriétés)
        return b.id - a.id;
      }).sort(function (a: Property, b: Property) {
        if (a.SubStatus == 2 || a.SubStatus == 3) { // un deuxième tri pour mettre les propriétés disponibles en premier
          if (b.SubStatus == 2 || b.SubStatus == 3) {
            return 0;
          }
          else {
            return -1;
          }
        }
        else {
          if (b.SubStatus == 2 || b.SubStatus == 3) {
            return 1;
          }
          else {
            return 0;
          }
        }
      })
      this.toShow = this.allProperties;
    });
  }





  get f() { return this.registerForm.controls; }

  onSubmit() {
    this.submitted = true;
    this.selectedTypes = this.registerForm.value.selected;
    this.cityZip = this.registerForm.value.zip;
    this.toShow = this.searchProperty(this.goal, 2, this.selectedTypes, this.cityZip, this.sliderRooms.minValue, this.sliderRooms.highValue, this.sliderBudget.minValue, this.sliderBudget.highValue);
    this.scrollTo("listProperty")
  }

  onReset() {
    this.submitted = false;
    this.registerForm.reset();
  }

  public scrollTo(elementId: string): void {
    this.viewportScroller.scrollToAnchor(elementId);
  }

  toggleClass(item) {
    this.items[0].select = false;
    this.items[1].select = false;
    this.sliderBudget.options.ceil = 20000;
    item.select = !item.select;
    if (this.items[0].select) {
      this.goal = 0;
      const newOptions: Options = Object.assign({}, this.sliderBudget.options);
      newOptions.ceil = 2000000;
      newOptions.floor = 0;
      newOptions.step = 10000;
      this.sliderBudget.options = newOptions;
    }
    else {
      this.goal = 1;
      const newOptions: Options = Object.assign({}, this.sliderBudget.options);
      newOptions.ceil = 5000;
      newOptions.step = 100;
      newOptions.translate
      this.sliderBudget.options = newOptions;
    }
    this.goalSelect = true;
  }

  searchProperty(goal: number, status: number, type: number[], zip: number[], minRoom: number, maxRoom: number, minPrice: number, maxPrice: number) {
    var toReturn: Property[];
    toReturn = [];
    for (let i = this.allProperties.length - 1; i >= 0; i--) {
      if (this.allProperties[i].SubStatus == 2 || this.allProperties[i].SubStatus == 3) {
        if (this.allProperties[i].Goal == goal && this.allProperties[i].SubStatus == status) {
          for (let j = 0; j < type.length; j++) {
            if (type[j] == this.allProperties[i].WebID) {
              for (let k = 0; k < zip.length; k++) {
                if (this.allProperties[i].Zip == zip[k]) {
                  if (this.allProperties[i].NumberOfBedRooms) {
                    if (this.allProperties[i].NumberOfBedRooms >= minRoom && this.allProperties[i].NumberOfBedRooms <= maxRoom) {
                      if (this.allProperties[i].Price >= minPrice && this.allProperties[i].Price <= maxPrice) {
                        toReturn.push(this.allProperties[i]);
                      }
                    }
                  }
                  else if (this.allProperties[i].Price >= minPrice && this.allProperties[i].Price <= maxPrice) {
                    toReturn.push(this.allProperties[i]);
                  }
                }
              }
            }
          }
        }
      }
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
          else if (value == 5000) {
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
