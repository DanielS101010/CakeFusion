import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CakeComponent } from './add-cake.component';

describe('AddCakeComponent', () => {
  let component: CakeComponent;
  let fixture: ComponentFixture<CakeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CakeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CakeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
