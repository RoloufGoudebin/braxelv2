import { Injectable } from '@angular/core';

export type CookieConsentStatus = 'accepted' | 'rejected';

const COOKIE_CONSENT_KEY = 'cookieConsent';

const CONSENT_PARAMS = [
  'ad_storage',
  'ad_user_data',
  'ad_personalization',
  'analytics_storage',
  'functionality_storage',
  'personalization_storage',
] as const;

@Injectable({
  providedIn: 'root',
})
export class ConsentService {
  getStoredConsent(): CookieConsentStatus | null {
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (consent === 'accepted' || consent === 'rejected') {
      return consent;
    }
    return null;
  }

  saveConsent(status: CookieConsentStatus): void {
    localStorage.setItem(COOKIE_CONSENT_KEY, status);
    this.applyGoogleConsent(status);
  }

  applyGoogleConsent(status: CookieConsentStatus): void {
    if (typeof window === 'undefined') {
      return;
    }

    const granted = status === 'accepted';
    const consentState = CONSENT_PARAMS.reduce(
      (state, param) => ({
        ...state,
        [param]: granted ? 'granted' : 'denied',
      }),
      {} as Record<(typeof CONSENT_PARAMS)[number], 'granted' | 'denied'>
    );

    window.dataLayer = window.dataLayer || [];
    window.gtag =
      window.gtag ||
      function gtag(...args: unknown[]) {
        window.dataLayer.push(args);
      };

    window.gtag('consent', 'update', consentState);
  }
}

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}
