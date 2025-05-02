import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterationSuccessComponent } from './registeration-success.component';

describe('RegisterationSuccessComponent', () => {
  let component: RegisterationSuccessComponent;
  let fixture: ComponentFixture<RegisterationSuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterationSuccessComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterationSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
