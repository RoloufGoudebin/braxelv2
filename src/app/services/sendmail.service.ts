import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SendmailService {

  constructor(private http: HttpClient) { }

  sendMail(message: any){
    console.log(message)
    this.http.post("https://braxel.be/sendmail", message).subscribe(
      data => {
        let res: any = data;
        console.log(
          `👏 > 👏 > 👏 > 👏 is successfully register and mail has been sent and the message id is ${res.messageId}`
        );
      },
      err => {
        console.log(err);
      }, () => {
      }
    );
  }
}
