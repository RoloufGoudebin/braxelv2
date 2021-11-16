import { Component } from '@angular/core';

import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Options } from '@angular-slider/ngx-slider';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ViewChild } from '@angular/core';
import { ElementRef } from '@angular/core';

interface SliderDetails {
  minValue: number;
  highValue: number;
  options: Options;
}

@Component({
  selector: 'app-alert-modal',
  templateUrl: './alert-modal.component.html',
  styleUrls: ['./alert-modal.component.css']
})
export class AlertModalComponent {
  closeResult = '';
  goal: number;
  goalSelect= false;
  successMessage: string;
  notConfirm = true;

  alertForm = new FormGroup({
    goal: new FormControl('', [Validators.required]),
    selected: new FormControl('', [Validators.required]),
    zip: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required]),
    surname: new FormControl('', [Validators.required]),
    mail: new FormControl('',[Validators.required])
  });

  items = [
    { name: 'Acheter', select: false },
    { name: 'Louer', select: false },
  ];

  types = [
    { id: 1, name: 'Maison' },
    { id: 2, name: 'Appartement' },
    { id: 3, name: 'Studio'},
    { id: 4, name: 'Terrain' },
    { id: 5, name: 'Immeubles' },
    { id: 6, name: 'Bureaux/Commerces' },
    { id: 7, name: 'Garage/Parking' },
  ];

  constructor(private modalService: NgbModal) { }

  openScrollableContent(longContent) {
    this.modalService.open(longContent, { scrollable: true });
  }

  onSubmit(){
    this.notConfirm = false;
    }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
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

  sliderSurface: SliderDetails =
    {
      minValue: 0,
      highValue: 500,
      options: {
        floor: 0,
        ceil: 500,
        step: 10,
      }
    }

  sliderPrice: SliderDetails =
    {
      minValue: 0,
      highValue: 2000000,
      options: {
        floor: 0,
        ceil: 2000000,
        step: 10000,
      }
    }

  sliderRadius: SliderDetails =
    {
      minValue: 0,
      highValue: 100,
      options: {
        floor: 0,
        ceil: 100,
        step: 1,
      }
    }


}
