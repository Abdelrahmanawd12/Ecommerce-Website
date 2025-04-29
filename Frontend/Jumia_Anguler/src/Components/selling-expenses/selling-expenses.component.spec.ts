import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellingExpensesComponent } from './selling-expenses.component';

describe('SellingExpensesComponent', () => {
  let component: SellingExpensesComponent;
  let fixture: ComponentFixture<SellingExpensesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SellingExpensesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SellingExpensesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
