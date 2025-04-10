import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JumiaGlobalBobupComponent } from './jumia-global-bobup.component';

describe('JumiaGlobalBobupComponent', () => {
  let component: JumiaGlobalBobupComponent;
  let fixture: ComponentFixture<JumiaGlobalBobupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JumiaGlobalBobupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JumiaGlobalBobupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
