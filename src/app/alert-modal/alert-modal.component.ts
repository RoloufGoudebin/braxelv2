import { Component, OnInit } from '@angular/core';

import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Options } from '@angular-slider/ngx-slider';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { OmnicasaService } from '../services/omnicasa/omnicasa.service';
import { SendmailService } from '../services/sendmail.service';
import { TypeScriptEmitter } from '@angular/compiler';


import data from '../json/zip.json'
import { TranslateService } from '@ngx-translate/core';

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
  roomTouch = false;
  budgetTouch = false;
  surfaceTouch = false;

  listOfZips = data;

  alertForm = new FormGroup({
    goal: new FormControl('',),
    selected: new FormControl('', [Validators.required]),
    zip: new FormControl('', [Validators.required]),
    particularites: new FormControl(''),
    firstname: new FormControl('', [Validators.required]),
    rooms: new FormControl('',),
    name: new FormControl('', [Validators.required]),
    mail: new FormControl('', [Validators.required]),
    phone: new FormControl('', [Validators.required])
  });

  items = [
    { name: 'navbar.13.a', select: false },
    { name: 'navbar.13.b', select: false },
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

  constructor(private modalService: NgbModal, private sendmail: SendmailService, private translate: TranslateService) { }

  ngOnInit(){
  }

  openScrollableContent(longContent) {
    this.modalService.open(longContent, { scrollable: true });
  }

  onSubmit(){
      let goal, type, budget, surface;

      if (this.alertForm.value.goal == 0){
        goal = "acheter";
      }
      else if (this.alertForm.value.goal == 1){
        goal = "louer";
      }

      for (let i = 0; i<this.alertForm.value.selected.length; i++){
        if (type){
          type = type + ", " + this.types[this.alertForm.value.selected[i]-1].name
        }
        else{
          type = this.types[this.alertForm.value.selected[i]-1].name
        }
      }

      if (this.sliderPrice.highValue == 2000000){
        budget = "+2 000 000"
      }
      else {
        budget = this.sliderPrice.highValue
      }

      if (this.sliderSurface.highValue == 500){
        surface = "+ 500"
      }
      else {
        surface = this.sliderSurface.highValue
      }

      let user = {
        message : "<p>Alerte pour des biens à " + goal +"</p>" + 
        "<p>Type(s) de bien(s): " + type + "</p>" +
        "<p>Codes postaux : " + this.alertForm.value.zip + "</p>" +
        "<p>Nombre de chambres : entre " + this.sliderRooms.minValue + " et " + this.sliderRooms.highValue + "</p>" +
        "<p>Budget : entre " +this.sliderPrice.minValue + " et " + budget + "</p>" +
        "<p>Surface : entre " + this.sliderSurface.minValue + " et " + surface + "</p>" +
        "<p>Autre particularités : " + this.alertForm.value.particularites + "</p>" +
        "<p>Nom : " + this.alertForm.value.name + "</p>" +
        "<p>Prénom : " + this.alertForm.value.firstname + "</p>" +
        "<p>Mail : " + this.alertForm.value.mail + "</p>" +
        "<p>Téléphone : " + this.alertForm.value.phone + "</p>"
      }
      this.sendmail.sendMail(user)

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

  touch(name: string){
    if(name=="room"){
      this.roomTouch=true;
    }
    if(name=="budget"){
      this.budgetTouch=true;
    }
    if(name=="surface"){
      this.surfaceTouch=true;
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
        translate: (value: number): string => {
          if(value==500){
            return "+" + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " m²";
          }
            return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " m²";
        }
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
        translate: (value: number): string => {
          if(value==2000000){
            return "+" + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " €";
          }
            return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " €";
        }
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

    get selected(){
      return this.alertForm.get('selected');
    }
    get zip(){
      return this.alertForm.get('zip');
    }
    get particularites(){
      return this.alertForm.get('particularites')
    }
    get name(){
      return this.alertForm.get('name');
    }
    get firstname(){
      return this.alertForm.get('firstname');
    }
    get mail(){
      return this.alertForm.get('mail');
    }
    get phone(){
      return this.alertForm.get('phone');
    }


}
