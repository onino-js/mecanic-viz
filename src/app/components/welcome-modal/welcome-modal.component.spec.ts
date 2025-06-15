import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WelcomeModalComponent } from './welcome-modal.component';

describe('WelcomeModalComponent', () => {
  let component: WelcomeModalComponent;
  let fixture: ComponentFixture<WelcomeModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WelcomeModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WelcomeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be visible by default', () => {
    expect(component.isVisible).toBe(true);
  });

  it('should not be visible after closeModal is called', () => {
    component.closeModal();
    expect(component.isVisible).toBe(false);
  });
});
