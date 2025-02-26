import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddToppingComponent } from './add-topping.component';

describe('AddToppingComponent', () => {
  let component: AddToppingComponent;
  let fixture: ComponentFixture<AddToppingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddToppingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddToppingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
