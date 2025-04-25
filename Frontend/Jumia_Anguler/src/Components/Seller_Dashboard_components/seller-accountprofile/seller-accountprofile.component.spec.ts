import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellerAccountprofileComponent } from './seller-accountprofile.component';

describe('SellerAccountprofileComponent', () => {
  let component: SellerAccountprofileComponent;
  let fixture: ComponentFixture<SellerAccountprofileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SellerAccountprofileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SellerAccountprofileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
