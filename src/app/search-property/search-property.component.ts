import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Options } from "@angular-slider/ngx-slider";
import { MustMatch } from './must-match.validators';
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

  constructor(private formBuilder: FormBuilder, private omnicasa: OmnicasaService) { }

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      zip: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      acceptTerms: [false, Validators.requiredTrue]
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

  get f() { return this.registerForm.controls; }

  onSubmit() {
    this.submitted = true;

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

  items = [
    { name: 'Acheter', active: false },
    { name: 'Louer', active: false }
  ];

  toggleClass(item) {
    this.items[0].active = false;
    this.items[1].active = false;
    this.items[2].active = false;
    item.active = "active";
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
