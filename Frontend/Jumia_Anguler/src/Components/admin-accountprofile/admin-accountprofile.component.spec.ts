import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAccountprofileComponent } from './admin-accountprofile.component';

describe('AdminAccountprofileComponent', () => {
  let component: AdminAccountprofileComponent;
  let fixture: ComponentFixture<AdminAccountprofileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminAccountprofileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminAccountprofileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
