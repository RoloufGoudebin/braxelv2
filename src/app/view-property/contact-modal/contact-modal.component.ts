import { Component, OnInit, Input } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { SendmailService } from 'src/app/services/sendmail.service';

@Component({
  selector: 'app-contact-modal',
  templateUrl: './contact-modal.component.html',
  styleUrls: ['./contact-modal.component.css']
})
export class ContactModalComponent {


  closeResult = '';
  notConfirm = true;
  
  @Input() id = '';

  contactForm = new FormGroup({
    firstname: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required]),
    mail: new FormControl('', [Validators.required]),
    phone: new FormControl('', [Validators.required])
  });
  
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
      message: "<p>Message venant de : " + this.contactForm.value.name + " " + this.contactForm.value.firstname + "</p><br><p> Email : " + this.contactForm.value.mail + "</p><br>" + "<p>Numéro de téléphone : " + this.contactForm.value.phone + "</p><br>" + "<p>Bonjour, pouvez vous me conacter pour le bien n°"+ this.id + "</p>"
    }
    this.sendmail.sendMail(user);
  }
  

}
