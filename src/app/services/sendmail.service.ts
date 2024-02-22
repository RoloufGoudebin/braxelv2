import { Injectable } from '@angular/core';
import { FirestoreService } from './firebase/firestore.service';
import { inject } from '@angular/core';

const COLLECTION_NAME = 'mail';
const RECEIVER_EMAIL = ['info@braxel.be','edouard@braxel.be','thomas@braxel.be','valentin@braxel.be','francois@braxel.be'];

interface Mail {
  to: string[]; //receiver email
  message: {
    subject: string;
    text: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class SendmailService {

  private _firestoreService: FirestoreService = inject(FirestoreService);

  constructor() { }

  sendMail(message: string, subject: string){
    const mail: Mail = {
      to: RECEIVER_EMAIL,
      message: {
        subject: `${subject}`,
        text: message
      }
    };
    this._firestoreService.addDocument(COLLECTION_NAME, mail);
    console.log(mail);
  }
}
