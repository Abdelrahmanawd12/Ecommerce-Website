import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProductDashboardComponent } from './add-product-dashboard.component';

describe('AddProductDashboardComponent', () => {
  let component: AddProductDashboardComponent;
  let fixture: ComponentFixture<AddProductDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddProductDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddProductDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
