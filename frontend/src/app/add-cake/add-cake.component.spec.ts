import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CakeComponent } from './add-cake.component';
import { FormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { ApiService } from '../api.service';
import { SharedDataService } from '../shared-data.service';
import { Router } from '@angular/router';

describe('CakeComponent', () => {
  let component: CakeComponent;
  let fixture: ComponentFixture<CakeComponent>;
  let mockApiService: jasmine.SpyObj<ApiService>;
  let mockSharedDataService: jasmine.SpyObj<SharedDataService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockApiService = jasmine.createSpyObj('ApiService', ['addCake']);
    mockSharedDataService = jasmine.createSpyObj(
      'SharedDataService',
      ['refreshCakes'],
      {
        doughs$: of([]),
        fillings$: of([]),
        toppings$: of([])
      }
    );
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [FormsModule, CakeComponent],
      providers: [
        { provide: ApiService, useValue: mockApiService },
        { provide: SharedDataService, useValue: mockSharedDataService },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CakeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component and subscribe to shared data', () => {
    expect(component).toBeTruthy();
    expect(component.doughs).toEqual([]);
    expect(component.fillings).toEqual([]);
    expect(component.toppings).toEqual([]);
  });

  describe('onComponentChange', () => {
    it('should add a component when checkbox is checked', () => {
      const event = { target: { value: '1', checked: true } };
      component.onComponentChange(event, 'dough', 1);
      expect(component.selectedComponents).toContain(
        jasmine.objectContaining({ type: 'dough', id: '1', quantity: 1 })
      );
    });

    it('should remove a component when checkbox is unchecked', () => {
      const event = { target: { value: '1', checked: true } };
      component.onComponentChange(event, 'dough', 1);
      expect(component.selectedComponents.length).toBe(1);
      const eventUncheck = { target: { value: '1', checked: false } };
      component.onComponentChange(eventUncheck, 'dough', 1);
      expect(component.selectedComponents).not.toContain(
        jasmine.objectContaining({ type: 'dough', id: '1', quantity: 1 })
      );
    });
  });

  describe('isComponentSelected', () => {
    it('should return true if a component is selected', () => {
      component.selectedComponents = [{ type: 'dough', id: '1', quantity: 1 }];
      expect(component.isComponentSelected('dough', '1')).toBeTrue();
    });

    it('should return false if a component is not selected', () => {
      component.selectedComponents = [];
      expect(component.isComponentSelected('dough', '1')).toBeFalse();
    });
  });

  describe('addCake', () => {
    beforeEach(() => {
      spyOn(window, 'alert');
    });

    it('should alert and not call apiService.addCake if cakeName is empty', () => {
      component.cakeName = '';
      component.selectedComponents = [{ type: 'dough', id: '1', quantity: 1 }];
      component.addCake();
      expect(window.alert).toHaveBeenCalledWith('Fülle alle benötigten Felder aus.');
      expect(mockApiService.addCake).not.toHaveBeenCalled();
    });

    it('should alert and not call apiService.addCake if no component is selected and ingredients/instructions are empty', () => {
      component.cakeName = 'Test Cake';
      component.selectedComponents = [];
      component.ingredients = '';
      component.instructions = '';
      component.addCake();
      expect(window.alert).toHaveBeenCalledWith('Fülle alle benötigten Felder aus.');
      expect(mockApiService.addCake).not.toHaveBeenCalled();
    });

    it('should call apiService.addCake when form is valid with components', () => {
      component.cakeName = 'Test Cake';
      component.selectedComponents = [{ type: 'dough', id: '1', quantity: 1 }];
      mockApiService.addCake.and.returnValue(of({}));
      component.addCake();
      expect(mockApiService.addCake).toHaveBeenCalledWith(
        'Test Cake',
        '',
        '',
        component.selectedComponents
      );
      expect(mockSharedDataService.refreshCakes).toHaveBeenCalled();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
    });

    it('should call apiService.addCake when form is valid without components', () => {
      component.cakeName = 'Test Cake';
      component.selectedComponents = [];
      component.ingredients = '100g Flour, 50g Sugar';
      component.instructions = 'Mix well';
      mockApiService.addCake.and.returnValue(of({}));
      component.addCake();
      expect(mockApiService.addCake).toHaveBeenCalledWith(
        'Test Cake',
        '100g Flour, 50g Sugar',
        'Mix well',
        []
      );
      expect(mockSharedDataService.refreshCakes).toHaveBeenCalled();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
    });
  });

  describe('getComponentName', () => {
    it('should return the dough name if found', () => {
      component.doughs = [{
        _id: '1', name: 'vanilladough',
        ingredients: [],
        instructions: '',
        quantity: 0
      }];
      expect(component.getComponentName('dough', '1')).toEqual('vanilladough');
    });

    it('should return the filling name if found', () => {
      component.fillings = [{
        _id: '2', name: 'chocolat filling',
        ingredients: [],
        instructions: '',
        quantity: 0
      }];
      expect(component.getComponentName('filling', '2')).toEqual('chocolat filling');
    });

    it('should return the topping name if found', () => {
      component.toppings = [{
        _id: '3', name: 'Strawberry topping',
        ingredients: [],
        instructions: '',
        quantity: 0
      }];
      expect(component.getComponentName('topping', '3')).toEqual('Strawberry topping');
    });

    it('should return an unknown message if the component is not found', () => {
      expect(component.getComponentName('dough', '99')).toEqual('Unbekannter Teig');
    });
  });

  describe('moveUp and moveDown', () => {
    beforeEach(() => {
      component.selectedComponents = [
        { type: 'dough', id: '1', quantity: 1 },
        { type: 'filling', id: '2', quantity: 1 },
        { type: 'topping', id: '3', quantity: 1 }
      ];
    });

    it('should move a component up in the list', () => {
      component.moveUp(1);
      expect(component.selectedComponents[0]).toEqual({ type: 'filling', id: '2', quantity: 1 });
      expect(component.selectedComponents[1]).toEqual({ type: 'dough', id: '1', quantity: 1 });
    });

    it('should not move the first component up', () => {
      component.moveUp(0);
      expect(component.selectedComponents[0]).toEqual({ type: 'dough', id: '1', quantity: 1 });
    });

    it('should move a component down in the list', () => {
      component.moveDown(1);
      expect(component.selectedComponents[1]).toEqual({ type: 'topping', id: '3', quantity: 1 });
      expect(component.selectedComponents[2]).toEqual({ type: 'filling', id: '2', quantity: 1 });
    });

    it('should not move the last component down', () => {
      component.moveDown(2);
      expect(component.selectedComponents[2]).toEqual({ type: 'topping', id: '3', quantity: 1 });
    });
  });
});
