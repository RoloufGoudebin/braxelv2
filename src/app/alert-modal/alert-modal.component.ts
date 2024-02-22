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
  goalSelect = false;
  successMessage: string;
  notConfirm = true;
  roomTouch = true;
  budgetTouch = true;
  surfaceTouch = true;

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
    { id: 1, name: 'navbar.16.a' },
    { id: 2, name: 'navbar.16.b' },
    { id: 3, name: 'navbar.16.c' },
    { id: 4, name: 'navbar.16.d' },
    { id: 5, name: 'navbar.16.e' },
    { id: 6, name: 'navbar.16.f' },
    { id: 7, name: 'navbar.16.g' },
  ];

  constructor(private modalService: NgbModal, private sendmail: SendmailService, private translate: TranslateService) { }

  ngOnInit() {
  }

  openScrollableContent(longContent) {
    this.modalService.open(longContent, { scrollable: true });
  }

  onSubmit() {
    let goal, type, budget, surface;

    if (this.alertForm.value.goal == 0) {
      goal = "acheter";
    }
    else if (this.alertForm.value.goal == 1) {
      goal = "louer";
    }

    type = this.alertForm.value.selected;

    if (this.sliderPrice.highValue == 2000000) {
      budget = "+2 000 000"
    }
    else {
      budget = this.sliderPrice.highValue
    }

    if (this.sliderSurface.highValue == 500) {
      surface = "+ 500"
    }
    else {
      surface = this.sliderSurface.highValue
    }

    let user = {
      subject: "Alerte bien",
      from: this.alertForm.value.mail,
      message: "Alerte pour des biens à " + goal +
        "\n\nType(s) de bien(s): " + type +
        "\n\nCodes postaux : " + this.alertForm.value.zip +
        "\n\nNombre de chambres : entre " + this.sliderRooms.minValue + " et " + this.sliderRooms.highValue +
        "\n\nBudget : entre " + this.sliderPrice.minValue + " et " + budget +
        "\n\nSurface : entre " + this.sliderSurface.minValue + " et " + surface +
        "\n\nAutre particularités : " + this.alertForm.value.particularites +
        "\n\nNom : " + this.alertForm.value.name +
        "\n\nPrénom : " + this.alertForm.value.firstname +
        "\n\nMail : " + this.alertForm.value.mail +
        "\n\nTéléphone : " + this.alertForm.value.phone
    }
    this.sendmail.sendMail(user.message, user.subject);

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

  touch(name: string) {
    if (name == "room") {
      this.roomTouch = true;
    }
    if (name == "budget") {
      this.budgetTouch = true;
    }
    if (name == "surface") {
      this.surfaceTouch = true;
    }
  }

  toggleClass(item) {
    this.items[0].select = false;
    this.items[1].select = false;
    item.select = !item.select;
    if (this.items[0].select) {
      this.goal = 0;
      const newOptions: Options = Object.assign({}, this.sliderPrice.options);
      newOptions.ceil = 2000000;
      newOptions.floor = 0;
      newOptions.step = 10000;
      this.sliderPrice.options = newOptions;
    }
    else {
      this.goal = 1;
      const newOptions: Options = Object.assign({}, this.sliderPrice.options);
      newOptions.ceil = 5000;
      newOptions.step = 100;
      newOptions.translate
      this.sliderPrice.options = newOptions;
    }
    this.goalSelect = true;
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
          if (value == 500) {
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
          if (value == 2000000) {
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

  get selected() {
    return this.alertForm.get('selected');
  }
  get zip() {
    return this.alertForm.get('zip');
  }
  get particularites() {
    return this.alertForm.get('particularites')
  }
  get name() {
    return this.alertForm.get('name');
  }
  get firstname() {
    return this.alertForm.get('firstname');
  }
  get mail() {
    return this.alertForm.get('mail');
  }
  get phone() {
    return this.alertForm.get('phone');
  }


}
