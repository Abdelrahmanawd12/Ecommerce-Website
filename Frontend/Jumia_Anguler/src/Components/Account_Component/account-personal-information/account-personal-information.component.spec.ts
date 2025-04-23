import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountPersonalInformationComponent } from './account-personal-information.component';

describe('AccountPersonalInformationComponent', () => {
  let component: AccountPersonalInformationComponent;
  let fixture: ComponentFixture<AccountPersonalInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountPersonalInformationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountPersonalInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
