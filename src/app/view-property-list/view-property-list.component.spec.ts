import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPropertyListComponent } from './view-property-list.component';

describe('ViewPropertyListComponent', () => {
  let component: ViewPropertyListComponent;
  let fixture: ComponentFixture<ViewPropertyListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewPropertyListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewPropertyListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
