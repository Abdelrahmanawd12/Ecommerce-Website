import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellNavbarComponent } from './sell-navbar.component';

describe('SellNavbarComponent', () => {
  let component: SellNavbarComponent;
  let fixture: ComponentFixture<SellNavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SellNavbarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SellNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
