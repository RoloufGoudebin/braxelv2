import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cookie-consent',
  templateUrl: './cookie-consent.component.html',
  styleUrls: ['./cookie-consent.component.css']
})
export class CookieConsentComponent implements OnInit {
  showBanner = false;

  ngOnInit(): void {
    // Vérifier si l'utilisateur a déjà donné son consentement
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      // Afficher le banner après un court délai
      setTimeout(() => {
        this.showBanner = true;
      }, 1000);
    }
  }

  acceptCookies(): void {
    localStorage.setItem('cookieConsent', 'accepted');
    this.showBanner = false;
  }

  rejectCookies(): void {
    localStorage.setItem('cookieConsent', 'rejected');
    this.showBanner = false;
  }
}


