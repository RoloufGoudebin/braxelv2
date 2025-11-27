import { Injectable, NgZone } from '@angular/core';
import { User } from "../services/user";
import { Router } from "@angular/router";
import { AngularFireAuth } from "@angular/fire/auth";


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  logged = false;
  private readonly REMEMBER_KEY = 'braxel_admin_remember';
  
  constructor(private router: Router) { }

  get isLoggedIn(): boolean {
      return this.logged;
    }

    signIn(mail: string, pwd: string, rememberMe: boolean = false){
      if (mail == "admin" && pwd == "Braxel12345") {
        this.logged = true;
        
        // Si "Rester connecté" est coché, enregistrer dans localStorage
        if (rememberMe) {
          localStorage.setItem(this.REMEMBER_KEY, 'true');
        } else {
          localStorage.removeItem(this.REMEMBER_KEY);
        }
        
        this.router.navigate(['/admin/top-biens']);
      }
    }

    checkRememberedUser(): void {
      // Vérifier si l'utilisateur a coché "Rester connecté"
      const remembered = localStorage.getItem(this.REMEMBER_KEY);
      if (remembered === 'true') {
        this.logged = true;
        this.router.navigate(['/admin/top-biens']);
      }
    }

    signOut(): void {
      this.logged = false;
      localStorage.removeItem(this.REMEMBER_KEY);
      this.router.navigate(['/admin/sign-in']);
    }


}
