import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProutComponent } from './prout.component';

describe('ProutComponent', () => {
  let component: ProutComponent;
  let fixture: ComponentFixture<ProutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
