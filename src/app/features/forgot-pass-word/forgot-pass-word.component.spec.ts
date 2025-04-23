import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgotPassWordComponent } from './forgot-pass-word.component';

describe('ForgotPassWordComponent', () => {
  let component: ForgotPassWordComponent;
  let fixture: ComponentFixture<ForgotPassWordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ForgotPassWordComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ForgotPassWordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
