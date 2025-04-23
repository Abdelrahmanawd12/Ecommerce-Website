import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellFooterComponent } from './sell-footer.component';

describe('SellFooterComponent', () => {
  let component: SellFooterComponent;
  let fixture: ComponentFixture<SellFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SellFooterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SellFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
