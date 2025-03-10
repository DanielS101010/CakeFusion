import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';

import { AddFillingComponent } from './add-filling.component';
import { ApiService } from '../api.service';
import { SharedDataService } from '../shared-data.service';

describe('AddFillingComponent with mocks', () => {
  let component: AddFillingComponent;
  let fixture: ComponentFixture<AddFillingComponent>;

  let apiServiceMock: jasmine.SpyObj<ApiService>;
  let sharedDataServiceMock: jasmine.SpyObj<SharedDataService>;
  let routerMock: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    apiServiceMock = jasmine.createSpyObj('ApiService', ['addFilling']);
    sharedDataServiceMock = jasmine.createSpyObj('SharedDataService', ['refreshFillings']);
    routerMock = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [AddFillingComponent],
      providers: [
        { provide: ApiService, useValue: apiServiceMock },
        { provide: SharedDataService, useValue: sharedDataServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AddFillingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should alert if required fields are missing and not call addFilling', () => {
    spyOn(window, 'alert');
    component.fillingName = ''; 
    component.fillingIngredients = '75g Almonds, 20g Sugar';
    component.fillingInstructions = 'Mix well';

    component.addFilling();

    expect(window.alert).toHaveBeenCalledWith('Fülle alle benötigten Felder aus.');
    expect(apiServiceMock.addFilling).not.toHaveBeenCalled();
  });

  it('should call apiService.addFilling and navigate on success', () => {
    component.fillingName = 'Test Filling';
    component.fillingIngredients = '75g Almonds, 20g Sugar';
    component.fillingInstructions = 'Mix well';

    apiServiceMock.addFilling.and.returnValue(of({}));

    component.addFilling();

    expect(apiServiceMock.addFilling).toHaveBeenCalledWith(
      'Test Filling',
      '75g Almonds, 20g Sugar',
      'Mix well',
      component.fillingQuantity
    );
    expect(sharedDataServiceMock.refreshFillings).toHaveBeenCalled();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should log error on API failure', () => {
    component.fillingName = 'Test Filling';
    component.fillingIngredients = '75g Almonds, 20g Sugar';
    component.fillingInstructions = 'Mix well';

    apiServiceMock.addFilling.and.returnValue(throwError(() => new Error('API error')));
    const consoleSpy = spyOn(console, 'log');

    component.addFilling();

    expect(consoleSpy).toHaveBeenCalledWith(jasmine.any(Error));
  });
});
