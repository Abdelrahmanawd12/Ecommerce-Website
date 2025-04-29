import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JumiaGlobalPopupComponent } from './jumia-global-bobup.component';

describe('JumiaGlobalBobupComponent', () => {
  let component: JumiaGlobalPopupComponent;
  let fixture: ComponentFixture<JumiaGlobalPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JumiaGlobalPopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JumiaGlobalPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
