import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';

import { AddDoughComponent } from './add-dough.component';
import { ApiService } from '../api.service';
import { SharedDataService } from '../shared-data.service';

describe('AddDoughComponent with mocks', () => {
  let component: AddDoughComponent;
  let fixture: ComponentFixture<AddDoughComponent>;

  let apiServiceMock: jasmine.SpyObj<ApiService>;
  let sharedDataServiceMock: jasmine.SpyObj<SharedDataService>;
  let routerMock: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    apiServiceMock = jasmine.createSpyObj('ApiService', ['addDough']);
    sharedDataServiceMock = jasmine.createSpyObj('SharedDataService', ['refreshDoughs']);
    routerMock = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [AddDoughComponent],
      providers: [
        { provide: ApiService, useValue: apiServiceMock },
        { provide: SharedDataService, useValue: sharedDataServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AddDoughComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should alert if required fields are missing and not call addDough', () => {
    spyOn(window, 'alert');
    component.doughName = ''; 
    component.doughIngredients = '200g Flour, 50ml Water';
    component.doughInstructions = 'Mix well';

    component.addDough();

    expect(window.alert).toHaveBeenCalledWith('Fülle alle benötigten Felder aus.');
    expect(apiServiceMock.addDough).not.toHaveBeenCalled();
  });

  it('should call apiService.addDough and navigate on success', () => {
    component.doughName = 'Test Dough';
    component.doughIngredients = '200g Flour, 50ml Water';
    component.doughInstructions = 'Mix well';

    apiServiceMock.addDough.and.returnValue(of({}));

    component.addDough();

    expect(apiServiceMock.addDough).toHaveBeenCalledWith(
      'Test Dough',
      '200g Flour, 50ml Water',
      'Mix well',
      component.doughQuantity
    );
    expect(sharedDataServiceMock.refreshDoughs).toHaveBeenCalled();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should log error on API failure', () => {
    component.doughName = 'Test Dough';
    component.doughIngredients = '200g Flour, 50ml Water';
    component.doughInstructions = 'Mix well';

    apiServiceMock.addDough.and.returnValue(throwError(() => new Error('API error')));
    const consoleSpy = spyOn(console, 'log');

    component.addDough();

    expect(consoleSpy).toHaveBeenCalledWith(jasmine.any(Error));
  });
});
