import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { SendmailService } from '../services/sendmail.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {

  constructor(private sendMail: SendmailService) { }

  contactForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    mail: new FormControl('', [Validators.required]),
    phone: new FormControl('', [Validators.required]),
    message: new FormControl('', [Validators.required])
  });

  ngOnInit(): void {
  }

  onSubmit() {
    let user = {
      message: "<p> Message venant de " + this.contactForm.value.name + "</p><br><p>Mail : " + this.contactForm.value.mail + "</p><br><p>Numéro de téléphone : " + this.contactForm.value.phone + "</p><br> <p>Concerne : " + this.contactForm.value.message + "</p>"
    }
    this.sendMail.sendMail(user);
  }

  get name(){
    return this.contactForm.get('message')
  }
  get mail(){
    return this.contactForm.get('mail')
  }
  get phone(){
    return this.contactForm.get('phone')
  }
  get message(){
    return this.contactForm.get('message')
  }

}
