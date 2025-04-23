import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopUpChangePassComponent } from './pop-up-change-pass.component';

describe('PopUpChangePassComponent', () => {
  let component: PopUpChangePassComponent;
  let fixture: ComponentFixture<PopUpChangePassComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopUpChangePassComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PopUpChangePassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
