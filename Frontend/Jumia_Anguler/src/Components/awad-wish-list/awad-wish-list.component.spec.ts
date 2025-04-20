import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AwadWishListComponent } from './awad-wish-list.component';

describe('AwadWishListComponent', () => {
  let component: AwadWishListComponent;
  let fixture: ComponentFixture<AwadWishListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AwadWishListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AwadWishListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
