import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TopBiensSellComponent } from './top-biens-sell.component';

describe('TopBiensSellComponent', () => {
  let component: TopBiensSellComponent;
  let fixture: ComponentFixture<TopBiensSellComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TopBiensSellComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopBiensSellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
