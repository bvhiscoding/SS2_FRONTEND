import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopUpCheckEmailComponent } from './pop-up-check-email.component';

describe('PopUpCheckEmailComponent', () => {
  let component: PopUpCheckEmailComponent;
  let fixture: ComponentFixture<PopUpCheckEmailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopUpCheckEmailComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PopUpCheckEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
