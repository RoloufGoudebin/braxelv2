import { Component, OnInit, Input } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { SendmailService } from 'src/app/services/sendmail.service';

@Component({
  selector: 'app-contact-modal',
  templateUrl: './contact-modal.component.html',
  styleUrls: ['./contact-modal.component.css']
})
export class ContactModalComponent{


  contactForm = new FormGroup({
    firstname: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required]),
    mail: new FormControl('', [Validators.required]),
    phone: new FormControl('', [Validators.required]),
    questions: new FormControl('')
  });

  closeResult = '';
  notConfirm = true;
  
  @Input() id = '';

  
  
  constructor(private modalService: NgbModal, private sendmail: SendmailService) { }

  open(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
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

  onSubmit(){
    
    let user = {
      message: "<p>Message venant de : " + this.contactForm.value.name + " " + this.contactForm.value.firstname + "</p><p> Email : " + this.contactForm.value.mail + "</p><p>Numéro de téléphone : " + this.contactForm.value.phone + "</p><p>Bonjour, pouvez vous me contacter pour le bien n°"+ this.id + "</p><p>Demande(s) spécifique(s) : " + this.contactForm.value.questions + "</p>"
    }
    this.sendmail.sendMail(user);
    this.notConfirm=false;
  }

  get firstname(){
    return this.contactForm.get('firstname');
  }
  get name(){
    return this.contactForm.get('name');
  }
  get mail(){
    return this.contactForm.get('mail');
  }
  get phone(){
    return this.contactForm.get('phone');
  }


  

}
