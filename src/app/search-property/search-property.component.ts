import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

import { Options } from "@angular-slider/ngx-slider";
import { Property } from '../services/omnicasa/interface';
import { OmnicasaService } from '../services/omnicasa/omnicasa.service'
import { FirestoreService } from '../services/firebase/firestore.service';
import { Output, EventEmitter } from '@angular/core';
import cities from 'src/app/services/models/cities.json'

interface SliderDetails {
  minValue: number;
  highValue: number;
  options: Options;
}


@Component({
  selector: 'app-search-property',
  templateUrl: './search-property.component.html',
  styleUrls: ['./search-property.component.css']
})
export class SearchPropertyComponent implements OnInit {

  @Output() newItemEvent = new EventEmitter<string[]>();

  registerForm = new FormGroup({
    goal: new FormControl('', [Validators.required]),
    selected: new FormControl('', [Validators.required]),
    zip: new FormControl('', [Validators.required])
  });

  cityZip;
  submitted = false;
  goalSelect = false;
  selectedTypes = [];
  goal;
  topPropertyList: Property[];

  constructor(private formBuilder: FormBuilder, private firestore: FirestoreService, private omnicasaService: OmnicasaService) { }

  ngOnInit(): void {
  }

  types = [
    { id: 1, name: 'Maison' },
    { id: 2, name: 'Appartement' },
    { id: 3, name: 'Studio'},
    { id: 4, name: 'Terrain' },
    { id: 5, name: 'Immeubles' },
    { id: 6, name: 'Bureaux/Commerces' },
    { id: 7, name: 'Garage/Parking' },
  ];

  items = [
    { name: 'Acheter', select: false },
    { name: 'Louer', select: false }
  ];

  get f() { return this.registerForm.controls; }

  onSubmit() {
    this.submitted = true;
    this.selectedTypes = this.registerForm.value.selected;
    this.cityZip = this.registerForm.value.zip;
    console.log(this.sliderRooms.minValue);

    // stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }

    this.topPropertyList = this.omnicasaService.propertyList;
  }

  onReset() {
    this.submitted = false;
    this.registerForm.reset();
  }

  toggleClass(item) {
    this.items[0].select = false;
    this.items[1].select = false;
    item.select = !item.select;
    if (this.items[0]) {
      this.goal = 0;
    }
    else {
      this.goal = 1;
    }
    this.goalSelect = true;
  }

  sliderRadius: SliderDetails =
    {
      minValue: 0,
      highValue: 100,
      options: {
        floor: 0,
        ceil: 100,
        step: 5,
      }
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
          return value + " €";
        }
      }
    }

  get selected() { return this.registerForm.get('selected'); }
  get zip() { return this.registerForm.get('zip'); }



}
