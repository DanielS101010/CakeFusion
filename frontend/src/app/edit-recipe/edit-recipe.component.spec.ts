import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditRecipeComponent } from './edit-recipe.component';
import { ApiService } from '../api.service';
import { SharedDataService } from '../shared-data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { Cake } from '../add-cake/cake.model';

describe('EditRecipeComponent', () => {
  let component: EditRecipeComponent;
  let fixture: ComponentFixture<EditRecipeComponent>;
  let apiServiceSpy: jasmine.SpyObj<ApiService>;
  let sharedDataServiceSpy: jasmine.SpyObj<SharedDataService>;
  let activatedRouteSpy: any;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    apiServiceSpy = jasmine.createSpyObj('ApiService', [
      'singleDough', 'singleFilling', 'singleTopping', 'singleCake',
      'updateDough', 'updateFilling', 'updateTopping', 'updateCake'
    ]);
    sharedDataServiceSpy = jasmine.createSpyObj('SharedDataService', [
      'refreshDoughs', 'refreshFillings', 'refreshToppings', 'refreshCakes'
    ]);
    activatedRouteSpy = {
      snapshot: {
        paramMap: {
          get: (key: string) => {
            if (key === 'id') return '123';
            if (key === 'component') return 'dough';
            return null;
          }
        }
      }
    };
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      providers: [
        { provide: ApiService, useValue: apiServiceSpy },
        { provide: SharedDataService, useValue: sharedDataServiceSpy },
        { provide: ActivatedRoute, useValue: activatedRouteSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EditRecipeComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load dough data on init if component is dough', () => {
    const doughData = {
      _id: '123',
      name: 'Test Dough',
      ingredients: [
        { quantity: 100, description: 'g flour' },
        { quantity: 20, description: 'ml water' }
      ],
      instructions: 'Mix well',
      quantity: 2,
    };
    apiServiceSpy.singleDough.and.returnValue(of(doughData));

    component.ngOnInit();
    fixture.detectChanges();

    expect(apiServiceSpy.singleDough).toHaveBeenCalledWith('123');
    expect(component.doughName).toEqual('Test Dough');
    expect(component.doughIngredients).toEqual('100 g flour\n20 ml water');
    expect(component.doughInstructions).toEqual('Mix well');
    expect(component.doughQuantity).toEqual(2);
  });

  it('should convert ingredients correctly', () => {
    const ingredientsStr = '100 g flour\n20 ml water\ninvalid';
    const result = component['convertIngredients'](ingredientsStr);
    expect(result).toEqual([
      { quantity: 100, description: 'g flour' },
      { quantity: 20, description: 'ml water' },
      { quantity: 0, description: 'invalid' },
    ]);
  });

  it('should add and remove a component on onComponentChange', () => {
    const event = { target: { checked: true } };
    component.selectedComponents = [];

    component.onComponentChange('dough', '123', event);
    expect(component.selectedComponents.length).toEqual(1);
    expect(component.selectedComponents[0]).toEqual({ type: 'dough', id: '123', quantity: 1 });

    event.target.checked = false;
    component.onComponentChange('dough', '123', event);
    expect(component.selectedComponents.length).toEqual(0);
  });

  it('should move components up and down', () => {
    component.selectedComponents = [
      { type: 'dough', id: '1', quantity: 1 },
      { type: 'filling', id: '2', quantity: 1 },
      { type: 'topping', id: '3', quantity: 1 },
    ];

    component.moveUp(1);
    expect(component.selectedComponents[0]).toEqual({ type: 'filling', id: '2', quantity: 1 });
    expect(component.selectedComponents[1]).toEqual({ type: 'dough', id: '1', quantity: 1 });

    component.moveDown(0);
    expect(component.selectedComponents[0]).toEqual({ type: 'dough', id: '1', quantity: 1 });
    expect(component.selectedComponents[1]).toEqual({ type: 'filling', id: '2', quantity: 1 });
  });

  it('should update dough on saveEdit when component is dough', () => {
    component.component = 'dough';
    component.id = '123';
    component.doughName = 'New Dough';
    component.doughIngredients = '10 g sugar\n1 g salt';
    component.doughInstructions = 'Mix well';
    component.doughQuantity = 3;

    apiServiceSpy.updateDough.and.returnValue(of({}));

    component.saveEdit();

    expect(apiServiceSpy.updateDough).toHaveBeenCalledWith(
      '123',
      'New Dough',
      '10 g sugar\n1 g salt',
      'Mix well',
      3
    );
    expect(sharedDataServiceSpy.refreshDoughs).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['Rezept/123/dough']);
  });

  it('should update cake on saveEdit when component is cake', () => {
    activatedRouteSpy.snapshot.paramMap.get = (key: string) => {
      if (key === 'id') return 'cake123';
      if (key === 'component') return 'cake';
      return null;
    };

    const cakeData = {
      _id: 'cake123',
      name: 'Test Cake',
      ingredients: [
        { quantity: 1, description: 'egg' },
        { quantity: 20, description: 'g flour' }
      ],
      instructions: 'Bake it well',
      components: [],
    } as Cake;
    
    apiServiceSpy.singleCake.and.returnValue(of(cakeData));

    sharedDataServiceSpy.doughs$ = of([]);
    sharedDataServiceSpy.fillings$ = of([]);
    sharedDataServiceSpy.toppings$ = of([]);

    component.ngOnInit();
    fixture.detectChanges();

    component.cakeName = 'Updated Cake';
    component.cakeIngredients = '2 egg\n30g flour';
    component.cakeInstructions = 'Bake at 350F';
    component.selectedComponents = [{ type: 'dough', id: '1', quantity: 1 }];

    apiServiceSpy.updateCake.and.returnValue(of({}));

    component.saveEdit();

    expect(apiServiceSpy.updateCake).toHaveBeenCalledWith(
      'cake123',
      'Updated Cake',
      '2 egg\n30 g flour',
      'Bake at 350F',
      [ jasmine.objectContaining({ type: 'dough', id: '1', quantity: 1 }) ]
    );
    
    expect(sharedDataServiceSpy.refreshCakes).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
  });
});
