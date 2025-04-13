import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntroSellerRegisterComponent } from './intro-seller-register.component';

describe('IntroSellerRegisterComponent', () => {
  let component: IntroSellerRegisterComponent;
  let fixture: ComponentFixture<IntroSellerRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IntroSellerRegisterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IntroSellerRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
