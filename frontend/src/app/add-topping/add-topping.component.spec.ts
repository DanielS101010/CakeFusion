import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';

import { AddToppingComponent } from './add-topping.component';
import { ApiService } from '../api.service';
import { SharedDataService } from '../shared-data.service';

describe('AddToppingComponent with mocks', () => {
  let component: AddToppingComponent;
  let fixture: ComponentFixture<AddToppingComponent>;

  let apiServiceMock: jasmine.SpyObj<ApiService>;
  let sharedDataServiceMock: jasmine.SpyObj<SharedDataService>;
  let routerMock: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    apiServiceMock = jasmine.createSpyObj('ApiService', ['addTopping']);
    sharedDataServiceMock = jasmine.createSpyObj('SharedDataService', ['refreshToppings']);
    routerMock = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [AddToppingComponent],
      providers: [
        { provide: ApiService, useValue: apiServiceMock },
        { provide: SharedDataService, useValue: sharedDataServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AddToppingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should alert if required fields are missing and not call addTopping', () => {
    spyOn(window, 'alert');
    component.toppingName = ''; 
    component.toppingIngredients = '100g chocolate, 50ml cream';
    component.toppingInstructions = 'Mix well';

    component.addTopping();

    expect(window.alert).toHaveBeenCalledWith('Fülle alle benötigten Felder aus.');
    expect(apiServiceMock.addTopping).not.toHaveBeenCalled();
  });

  it('should call apiService.addTopping and navigate on success', () => {
    component.toppingName = 'Test Topping';
    component.toppingIngredients = '100g chocolate, 50ml cream';
    component.toppingInstructions = 'Mix thoroughly';

    apiServiceMock.addTopping.and.returnValue(of({}));

    component.addTopping();

    expect(apiServiceMock.addTopping).toHaveBeenCalledWith(
      'Test Topping',
      '100g chocolate, 50ml cream',
      'Mix thoroughly',
      component.toppingQuantity
    );
    expect(sharedDataServiceMock.refreshToppings).toHaveBeenCalled();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should log error on API failure', () => {
    component.toppingName = 'Test Topping';
    component.toppingIngredients = '100g chocolate, 50ml cream';
    component.toppingInstructions = 'Mix thoroughly';

    apiServiceMock.addTopping.and.returnValue(throwError(() => new Error('API error')));
    const consoleSpy = spyOn(console, 'log');

    component.addTopping();

    expect(consoleSpy).toHaveBeenCalledWith(jasmine.any(Error));
  });
});
