import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EstimationModalComponent } from './estimation-modal.component';

describe('EstimationModalComponent', () => {
  let component: EstimationModalComponent;
  let fixture: ComponentFixture<EstimationModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EstimationModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EstimationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
