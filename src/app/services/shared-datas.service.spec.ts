import { TestBed } from '@angular/core/testing';

import { SharedDatasService } from './shared-datas.service';

describe('SharedDatasService', () => {
  let service: SharedDatasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SharedDatasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
