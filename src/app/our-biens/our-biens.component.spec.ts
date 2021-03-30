import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OurBiensComponent } from './our-biens.component';

describe('OurBiensComponent', () => {
  let component: OurBiensComponent;
  let fixture: ComponentFixture<OurBiensComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OurBiensComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OurBiensComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
