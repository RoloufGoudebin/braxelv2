import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TopBiensComponent } from './top-biens.component';

describe('TopBiensComponent', () => {
  let component: TopBiensComponent;
  let fixture: ComponentFixture<TopBiensComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TopBiensComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopBiensComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
