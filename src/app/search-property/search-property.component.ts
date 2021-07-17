import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

import { Options } from "@angular-slider/ngx-slider";
import { MustMatch, goalValidator } from './must-match.validators';
import { OmnicasaService } from '../services/omnicasa/omnicasa.service'

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

  registerForm: FormGroup;
  cityZip;
  submitted = false;
  goalSelect = false;
  selectedTypes = [];

  constructor(private formBuilder: FormBuilder, private omnicasa: OmnicasaService) { }

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      zip: ['', Validators.required],
      goal: ['', goalValidator],
      confirmPassword: ['', Validators.required],
      acceptTerms: [false, Validators.requiredTrue],
      lastName: ['', Validators.required],
    }, {
      validator: MustMatch('password', 'confirmPassword')
    });
    this.cityZip = this.omnicasa.getListOfZip;
  }

  types = [
    { id: 1, name: 'Maison' },
    { id: 2, name: 'Appartement', disabled: true },
    { id: 3, name: 'Terrain' },
    { id: 4, name: 'Bureaux/Commerces' },
    { id: 5, name: 'Immeubles' },
    { id: 6, name: 'Garage/Parking' },
  ];

  items = [
    { name: 'Acheter', select: false },
    { name: 'Louer', select: false }
  ];

  get f() { return this.registerForm.controls; }

  onSubmit() {
    this.submitted = true;
    this.selectedTypes = this.selectedTypes;
    console.log(this.selectedTypes);

    // stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }

    // display form values on success
    alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.registerForm.value, null, 4));

    
  }

  onReset() {
    this.submitted = false;
    this.registerForm.reset();
  }

  toggleClass(item) {
    this.items[0].select = false;
    this.items[1].select = false;
    item.select = !item.select;
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



}
