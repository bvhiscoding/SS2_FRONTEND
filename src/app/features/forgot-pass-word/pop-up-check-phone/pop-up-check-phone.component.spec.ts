import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopUpCheckPhoneComponent } from './pop-up-check-phone.component';

describe('PopUpCheckPhoneComponent', () => {
  let component: PopUpCheckPhoneComponent;
  let fixture: ComponentFixture<PopUpCheckPhoneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopUpCheckPhoneComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PopUpCheckPhoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
