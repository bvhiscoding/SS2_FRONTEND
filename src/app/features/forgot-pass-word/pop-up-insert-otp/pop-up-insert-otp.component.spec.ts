import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopUpInsertOTPComponent } from './pop-up-insert-otp.component';

describe('PopUpInsertOTPComponent', () => {
  let component: PopUpInsertOTPComponent;
  let fixture: ComponentFixture<PopUpInsertOTPComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopUpInsertOTPComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PopUpInsertOTPComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
