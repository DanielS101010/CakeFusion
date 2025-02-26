import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDoughComponent } from './add-dough.component';

describe('AddDoughComponent', () => {
  let component: AddDoughComponent;
  let fixture: ComponentFixture<AddDoughComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddDoughComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddDoughComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
