import { Component } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Options } from '@angular-slider/ngx-slider';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { OmnicasaService } from '../services/omnicasa/omnicasa.service';
import { SendmailService } from '../services/sendmail.service';
import { TypeScriptEmitter } from '@angular/compiler';

interface SliderDetails {
  minValue: number;
  highValue: number;
  options: Options;
}

@Component({
  selector: 'app-estimation-modal',
  templateUrl: './estimation-modal.component.html',
  styleUrls: ['./estimation-modal.component.css']
})

export class EstimationModalComponent {
  closeResult = '';
  goal: number;
  goalSelect = false;
  successMessage: string;
  notConfirm = true;

  alertForm = new FormGroup({
    goal: new FormControl('',),
    selected: new FormControl('', [Validators.required]),
    zip: new FormControl('', [Validators.required]),
    street: new FormControl('', Validators.required),
    particularites: new FormControl(''),
    firstname: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required]),
    mail: new FormControl('', [Validators.required]),
    phone: new FormControl('', [Validators.required])
  });

  items = [
    { name: 'Vendre', select: false },
    { name: 'Louer', select: false },
  ];

  types = [
    { id: 1, name: 'Maison' },
    { id: 2, name: 'Appartement' },
    { id: 3, name: 'Studio' },
    { id: 4, name: 'Terrain' },
    { id: 5, name: 'Immeubles' },
    { id: 6, name: 'Bureaux/Commerces' },
    { id: 7, name: 'Garage/Parking' },
  ];

  constructor(private modalService: NgbModal, private omnicasaService: OmnicasaService, private sendmail: SendmailService) { }

  openScrollableContent(longContent) {
    this.modalService.open(longContent, { scrollable: true });
  }

  onSubmit() {
    let goal, type, budget, surface;

    if (this.alertForm.value.goal == 0) {
      goal = "Vente";
    }
    else if (this.alertForm.value.goal == 1) {
      goal = "Location";
    }

    for (let i = 0; i < this.alertForm.value.selected.length; i++) {
      if (type) {
        type = type + ", " + this.types[this.alertForm.value.selected[i] - 1].name
      }
      else {
        type = this.types[this.alertForm.value.selected[i] - 1].name
      }
    }

    let user = {
      message: "<p>Demande d'estimation pour un bien destiné à la " + goal + "</p>" +
        "<p>Type(s) de bien(s): " + type + "</p>" +
        "<p>Adresse: " + this.alertForm.value.street + ", " + this.alertForm.value.zip + "</p>" +
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

  get selected() {
    return this.alertForm.get('selected');
  }
  get zip() {
    return this.alertForm.get('zip');
  }
  get street() {
    return this.alertForm.get('street');
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

