import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CookieConsentComponent } from './cookie-consent.component';
import { ConsentService } from '../services/consent.service';

describe('CookieConsentComponent', () => {
  let component: CookieConsentComponent;
  let fixture: ComponentFixture<CookieConsentComponent>;
  let consentService: jasmine.SpyObj<ConsentService>;

  beforeEach(async () => {
    consentService = jasmine.createSpyObj('ConsentService', [
      'getStoredConsent',
      'saveConsent',
    ]);
    consentService.getStoredConsent.and.returnValue(null);

    await TestBed.configureTestingModule({
      declarations: [ CookieConsentComponent ],
      providers: [{ provide: ConsentService, useValue: consentService }],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CookieConsentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});


