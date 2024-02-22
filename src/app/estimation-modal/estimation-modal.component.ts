import { Component, Input } from '@angular/core';
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

  @Input() tapbar : boolean; // savoir si on affiche la calculette ou pas

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
    { name: 'estimation.4.a', select: false },
    { name: 'estimation.4.b', select: false },
  ];

  types = [
    { id: 1, name: 'estimation.7.a' },
    { id: 2, name: 'estimation.7.b' },
    { id: 3, name: 'estimation.7.c' },
    { id: 4, name: 'estimation.7.d' },
    { id: 5, name: 'estimation.7.e' },
    { id: 6, name: 'estimation.7.f' },
    { id: 7, name: 'estimation.7.g' },
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

    type = this.alertForm.value.selected;

    let user = {
      subject : "Estimation bien",
      from : this.alertForm.value.mail,
      message: "\n\nDemande d'estimation pour un bien destiné à la " + goal +  
        "\n\nType(s) de bien(s): " + type +  
        "\n\nAdresse: " + this.alertForm.value.street + ", " + this.alertForm.value.zip +  
        "\n\nAutre particularités : " + this.alertForm.value.particularites +  
        "\n\nNom : " + this.alertForm.value.name +  
        "\n\nPrénom : " + this.alertForm.value.firstname +  
        "\n\nMail : " + this.alertForm.value.mail +  
        "\n\nTéléphone : " + this.alertForm.value.phone + "</p>"
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

