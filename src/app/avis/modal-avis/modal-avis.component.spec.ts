import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAvisComponent } from './modal-avis.component';

describe('ModalAvisComponent', () => {
  let component: ModalAvisComponent;
  let fixture: ComponentFixture<ModalAvisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalAvisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalAvisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
