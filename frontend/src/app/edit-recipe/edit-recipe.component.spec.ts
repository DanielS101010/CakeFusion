import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditRecipeComponent } from './edit-recipe.component';
import { ApiService } from '../service/api.service';
import { SharedDataService } from '../service/shared-data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { Cake } from '../add-cake/cake.model';
import { Dough } from '../add-dough/dough.model';
import { Filling } from '../add-filling/filling.model';
import { Topping } from '../add-topping/topping.model';
import { TagsService } from '../service/tags.service';

describe('EditRecipeComponent', () => {
  let component: EditRecipeComponent;
  let fixture: ComponentFixture<EditRecipeComponent>;
  let apiServiceSpy: jasmine.SpyObj<ApiService>;
  let sharedDataServiceSpy: jasmine.SpyObj<SharedDataService>;
  let activatedRouteSpy: any;
  let routerSpy: jasmine.SpyObj<Router>;

  const tagsServiceStub = {
    addTagToComponent: (tagName: string, tags: any[]) => {
      const newTag = { _id: 'newTagId', name: tagName };
      return of([...tags, newTag]);
    },
    deleteTagFromComponent: (id: string, tags: any[]) =>
      tags.filter(tag => tag._id !== id)
  };

  beforeEach(async () => {
    apiServiceSpy = jasmine.createSpyObj('ApiService', [
      'singleDough', 'singleFilling', 'singleTopping', 'singleCake',
      'updateDough', 'updateFilling', 'updateTopping', 'updateCake'
    ]);
    
  sharedDataServiceSpy = jasmine.createSpyObj('SharedDataService', 
    ['refreshDoughs', 'refreshFillings', 'refreshToppings', 'refreshCakes'], 
    {
      tags$: of([]),
      doughs$: of([]),
      fillings$: of([]),
      toppings$: of([])
    }
  );

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
        { provide: Router, useValue: routerSpy },
        { provide: TagsService, useValue: tagsServiceStub },
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
      tags: [],
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

  it('should return dough name when dough is found', () => {
  component.doughs = [{ _id: '1', name: 'flaky pastry' } as Dough];
  expect(component.getComponentName('dough', '1')).toEqual('flaky pastry');
});

  it('should return "Unbekannter Teig" when dough is not found', () => {
    component.doughs = [];
    expect(component.getComponentName('dough', '999')).toEqual('Unbekannter Teig');
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
  it('should not change array order if moveUp is called on first element', () => {
    component.selectedComponents = [
      { type: 'dough', id: '1', quantity: 1 },
      { type: 'filling', id: '2', quantity: 1 }
    ];
    const initialArray = [...component.selectedComponents];
    
    component.moveUp(0);
    expect(component.selectedComponents).toEqual(initialArray);
  });

  it('should not change array order if moveDown is called on last element', () => {
    component.selectedComponents = [
      { type: 'topping', id: '3', quantity: 1 },
      { type: 'dough', id: '1', quantity: 1 }
    ];
    const initialArray = [...component.selectedComponents];
    
    component.moveDown(component.selectedComponents.length - 1);
    expect(component.selectedComponents).toEqual(initialArray);
  });


  it('should update dough on saveEdit when component is dough', () => {
    component.component = 'dough';
    component.id = '123';
    component.doughName = 'New Dough';
    component.doughIngredients = '10 g sugar\n1 g salt';
    component.doughInstructions = 'Mix well';
    component.doughQuantity = 3;
    component.doughTags = [{_id:'1', name:'chocolate'}, {_id:'2', name:'sugar'}]

    apiServiceSpy.updateDough.and.returnValue(of({}));

    component.saveEdit();

    expect(apiServiceSpy.updateDough).toHaveBeenCalledWith(
      '123',
      'New Dough',
      '10 g sugar\n1 g salt',
      'Mix well',
      3,
      ["1", "2"]
    );
    expect(sharedDataServiceSpy.refreshDoughs).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['Rezept/123/dough']);
  });

  it('should log error on updateDough failure', () => {
    spyOn(console, 'log');
    component.component = 'dough';
    component.id = '123';
    component.doughName = 'Error Filling';
    component.doughIngredients = '10 g cocoa';
    component.doughInstructions = 'Stir well';
    component.doughQuantity = 1;
    component.doughTags = [];

    apiServiceSpy.updateDough.and.returnValue(throwError(() => new Error('error')));

    component.saveEdit();

    expect(console.log).toHaveBeenCalledWith( new Error('error') );
    expect(sharedDataServiceSpy.refreshDoughs).not.toHaveBeenCalled();
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });

  it('should load filling data on init if component is filling', () => {
    activatedRouteSpy.snapshot.paramMap.get = (key: string) => {
      if (key === 'id') return '123';
      if (key === 'component') return 'filling';
      return null;
    };
    const fillingData = {
      _id: '123',
      name: 'Test Filling',
      ingredients: [
        { quantity: 50, description: 'g chocolate' }
      ],
      instructions: 'Stir well',
      quantity: 1,
      tags: [],
    };
    apiServiceSpy.singleFilling.and.returnValue(of(fillingData));

    component.ngOnInit();
    fixture.detectChanges();

    expect(apiServiceSpy.singleFilling).toHaveBeenCalledWith('123');
    expect(component.fillingName).toEqual('Test Filling');
    expect(component.fillingIngredients).toEqual('50 g chocolate');
    expect(component.fillingInstructions).toEqual('Stir well');
    expect(component.fillingQuantity).toEqual(1);
  });

  it('should update filling on saveEdit when component is filling', () => {
    component.component = 'filling';
    component.id = '123';
    component.fillingName = 'New Filling';
    component.fillingIngredients = '50 g chocolate\n5 g butter';
    component.fillingInstructions = 'Mix';
    component.fillingQuantity = 2;
    component.fillingTags = [{_id:'2', name:'chocolate'}];

    apiServiceSpy.updateFilling.and.returnValue(of({}));

    component.saveEdit();

    expect(apiServiceSpy.updateFilling).toHaveBeenCalledWith(
      '123',
      'New Filling',
      '50 g chocolate\n5 g butter',
      'Mix',
      2,
      ['2']
    );
    expect(sharedDataServiceSpy.refreshFillings).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['Rezept/123/filling']);
  });

  it('should return filling name when filling is found', () => {
    component.fillings = [{ _id: '1', name: 'chocolate' } as Filling];
    expect(component.getComponentName('filling', '1')).toEqual('chocolate');
  });

  it('should return "Unbekannte Füllung" for missing filling', () => {
    component.fillings = [];
    expect(component.getComponentName('filling', 'unknown')).toEqual('Unbekannte Füllung');
  });
    
  it('should log error on updateFilling failure', () => {
  spyOn(console, 'log');
  component.component = 'filling';
  component.id = '123';
  component.fillingName = 'Error Filling';
  component.fillingIngredients = '10 g cocoa';
  component.fillingInstructions = 'Stir well';
  component.fillingQuantity = 1;
  component.fillingTags = [];

  apiServiceSpy.updateFilling.and.returnValue(throwError(() => new Error('error')));

  component.saveEdit();

  expect(console.log).toHaveBeenCalledWith( new Error('error') );
  expect(sharedDataServiceSpy.refreshFillings).not.toHaveBeenCalled();
  expect(routerSpy.navigate).not.toHaveBeenCalled();
});

  it('should load topping data on init if component is topping', () => {
    activatedRouteSpy.snapshot.paramMap.get = (key: string) => {
      if (key === 'id') return 't123';
      if (key === 'component') return 'topping';
      return null;
    };
    const toppingData = {
      _id: 't123',
      name: 'Test Topping',
      ingredients: [{ quantity: 10, description: 'ml syrup' }],
      instructions: 'Drizzle evenly',
      quantity: 2,
      tags: [],
    };
    apiServiceSpy.singleTopping.and.returnValue(of(toppingData));

    component.ngOnInit();
    fixture.detectChanges();

    expect(apiServiceSpy.singleTopping).toHaveBeenCalledWith('t123');
    expect(component.toppingName).toEqual('Test Topping');
    expect(component.toppingIngredients).toEqual('10 ml syrup');
    expect(component.toppingInstructions).toEqual('Drizzle evenly');
    expect(component.toppingQuantity).toEqual(2);
  });

  it('should update topping on saveEdit when component is topping', () => {
    component.component = 'topping';
    component.id = 't123';
    component.toppingName = 'New Topping';
    component.toppingIngredients = '15 ml syrup\n2 g nuts';
    component.toppingInstructions = 'Drizzle on top';
    component.toppingQuantity = 4;
    component.toppingTags = [{_id:'2', name:'crunchy'}];

    apiServiceSpy.updateTopping.and.returnValue(of({}));

    component.saveEdit();

    expect(apiServiceSpy.updateTopping).toHaveBeenCalledWith(
      't123',
      'New Topping',
      '15 ml syrup\n2 g nuts',
      'Drizzle on top',
      4,
      ['2']
    );
    expect(sharedDataServiceSpy.refreshToppings).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['Rezept/t123/topping']);
  });

  it('should return topping name when topping is found', () => {
    component.toppings = [{ _id: '1', name: 'chocolate' } as Topping];
    expect(component.getComponentName('topping', '1')).toEqual('chocolate');
  });

  it('should return "Unbekannte Füllung" for missing filling', () => {
    component.toppings = [];
    expect(component.getComponentName('topping', 'unknown')).toEqual('Unbekannter Topping');
  });

  it('should log error on updateTopping failure', () => {
    spyOn(console, 'log');
    component.component = 'topping';
    component.id = '123';
    component.toppingName = 'Error topping';
    component.toppingIngredients = '10 g cocoa';
    component.toppingInstructions = 'Stir well';
    component.toppingQuantity = 1;
    component.toppingTags = [];

    apiServiceSpy.updateTopping.and.returnValue(throwError(() => new Error('error')));

    component.saveEdit();

    expect(console.log).toHaveBeenCalledWith( new Error('error') );
    expect(sharedDataServiceSpy.refreshToppings).not.toHaveBeenCalled();
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });

it('should return "Unbekannte Komponente" for unknown component type', () => {
  expect(component.getComponentName('unknown', '1')).toEqual('Unbekannte Komponente');
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
    } as unknown as Cake;
    
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
      [ jasmine.objectContaining({ type: 'dough', id: '1', quantity: 1 }) ],
      []
    );
    
    expect(sharedDataServiceSpy.refreshCakes).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
  });
});
