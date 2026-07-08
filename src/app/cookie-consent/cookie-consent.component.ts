import { Component, OnInit } from '@angular/core';
import { ConsentService } from '../services/consent.service';

@Component({
  selector: 'app-cookie-consent',
  templateUrl: './cookie-consent.component.html',
  styleUrls: ['./cookie-consent.component.css']
})
export class CookieConsentComponent implements OnInit {
  showBanner = false;

  constructor(private consentService: ConsentService) {}

  ngOnInit(): void {
    if (!this.consentService.getStoredConsent()) {
      setTimeout(() => {
        this.showBanner = true;
      }, 1000);
    }
  }

  acceptCookies(): void {
    this.consentService.saveConsent('accepted');
    this.showBanner = false;
  }

  rejectCookies(): void {
    this.consentService.saveConsent('rejected');
    this.showBanner = false;
  }
}


