import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from "../services/auth.service";
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate {

  constructor(public authService: AuthService, public router: Router
  ) { }

  canActivate(): boolean {

    if (this.authService.logged !== true) {
      this.router.navigate(['admin']);
    }

    return this.authService.isLoggedIn;
  }

}
