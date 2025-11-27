import { Component, OnInit } from '@angular/core';
import { AuthService } from  '../services/auth.service';


@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css'],
})
export class SignInComponent implements OnInit {
  rememberMe = false;

  constructor(public authService:  AuthService) { }

  ngOnInit(): void {
    // Vérifier si l'utilisateur est déjà connecté via cookie
    this.authService.checkRememberedUser();
  }

  signIn(email: string, password: string): void {
    this.authService.signIn(email, password, this.rememberMe);
  }

}
