import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SendmailService {

  constructor(private http: HttpClient) { }

  sendMail(message: any){
    let user = {
      to: '<info@braxel.be>,<edouard@braxel.be>,<thomas@braxel.be>,<valentin@braxel.be>,<francois@braxel.be>',
      from: message.from,
      subject: message.subject,
      message: message.message
    };
  
    this.http
      .post(
        'https://us-central1-mamoot-api.cloudfunctions.net/sendMail',
        user
      )
      .subscribe(
        data => {
          let res: any = data;
          console.log(
            `👏 > 👏 > 👏 > 👏 is successfully register and mail has been sent and the message id is ${res.messageId}`
          );
        },
        err => {
          console.log(err);
        },
        () => {}
      );

  }

  
}
