import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CodeDeontologieComponent } from './code-deontologie.component';

describe('CodeDeontologieComponent', () => {
  let component: CodeDeontologieComponent;
  let fixture: ComponentFixture<CodeDeontologieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CodeDeontologieComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CodeDeontologieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
