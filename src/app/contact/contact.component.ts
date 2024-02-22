import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { SendmailService } from '../services/sendmail.service';
import { Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {

  constructor(private sendMail: SendmailService, private meta : Meta) { }

  contactForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    mail: new FormControl('', [Validators.required]),
    phone: new FormControl('', [Validators.required]),
    message: new FormControl('', [Validators.required])
  });

  ngOnInit(): void {
    this.meta.updateTag({name:'canonical', content:'https://braxel.be/contact'})
  }

  onSubmit() {
    let user = {
      subject : "Contact site",
      from : this.contactForm.value.mail,
      message: "Message venant de " + this.contactForm.value.name + 
      "\n\n Mail : " + this.contactForm.value.mail + 
      "\n\n Numéro de téléphone : " + this.contactForm.value.phone 
      + "\n\nConcerne : " + this.contactForm.value.message
    }
    this.sendMail.sendMail(user.message, user.subject);
    this.contactForm.reset();
  }

  get name() {
    return this.contactForm.get('name')
  }
  get mail() {
    return this.contactForm.get('mail')
  }
  get phone() {
    return this.contactForm.get('phone')
  }
  get message() {
    return this.contactForm.get('message')
  }

}
