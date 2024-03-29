import { Injectable, NgZone } from '@angular/core';
import { User } from "../services/user";
import { Router } from "@angular/router";
import { AngularFireAuth } from "@angular/fire/auth";


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  logged = false;
  constructor(private router: Router) { }

  get isLoggedIn(): boolean {
      return this.logged;
    }

    signIn(mail: string, pwd: string){
      if (mail == "admin" && pwd == "Braxel12345") {
        this.logged = true;
        this.router.navigate(['/admin/top-biens']);
      }
    }


}
