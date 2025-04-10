import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellOnJumiaComponent } from './sell-on-jumia.component';

describe('SellOnJumiaComponent', () => {
  let component: SellOnJumiaComponent;
  let fixture: ComponentFixture<SellOnJumiaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SellOnJumiaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SellOnJumiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
