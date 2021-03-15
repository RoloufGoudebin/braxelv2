import { TestBed } from '@angular/core/testing';

import { OmnicasaService } from './omnicasa.service';

describe('OmnicasaService', () => {
  let service: OmnicasaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OmnicasaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
