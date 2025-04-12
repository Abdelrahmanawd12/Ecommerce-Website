import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellerDashboardSidebarComponent } from './seller-dashboard-sidebar.component';

describe('SellerDashboardSidebarComponent', () => {
  let component: SellerDashboardSidebarComponent;
  let fixture: ComponentFixture<SellerDashboardSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SellerDashboardSidebarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SellerDashboardSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
