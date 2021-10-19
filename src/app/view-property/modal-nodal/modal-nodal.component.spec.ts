import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalNodalComponent } from './modal-nodal.component';

describe('ModalNodalComponent', () => {
  let component: ModalNodalComponent;
  let fixture: ComponentFixture<ModalNodalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalNodalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalNodalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
