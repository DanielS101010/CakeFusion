import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { of } from 'rxjs';
import { ShowRecipeComponent } from './show-recipe.component';
import { ApiService } from '../service/api.service';
import { Dough } from '../add-dough/dough.model';
import { Filling } from '../add-filling/filling.model';
import { Topping } from '../add-topping/topping.model';
import { Cake, Ingredient } from '../add-cake/cake.model';

describe('ShowRecipeComponent', () => {
  let component: ShowRecipeComponent;
  let fixture: ComponentFixture<ShowRecipeComponent>;
  let fakeApiService: any;

  // Define fake data objects for each type.
  const fakeDoughData: Dough = {
    _id: 'd1', name: 'Test Dough', ingredients: [{ quantity: 10, description: "Flour" }], 
    instructions: 'Mix well', quantity: 10, tags: []
  };
  const fakeFillingData: Filling = {
    _id: 'f1', name: 'Test Filling', ingredients: [{ quantity: 10, description: "Flour" }],
    instructions: "Mix well", quantity: 5, tags: []
  };
  const fakeToppingData: Topping = {
    _id: 't1', name: 'Test Topping', ingredients: [{ quantity: 10, description: "Flour" }],
    instructions: "Mix well", quantity: 2, tags: []
  };
  const fakeCakeData: Cake = {
    _id: 'c1',
    // Cake components define which subcomponent is used and the quantity needed.
    components: [
      { id: 'd1', type: 'dough', quantity: 3 },
      { id: 'f1', type: 'filling', quantity: 2 },
      { id: 't1', type: 'topping', quantity: 1 }
    ],
    ingredients: [],
    instructions: '',
    name: '',
    tags: []
  };

  // Helper function to create a fake ActivatedRoute.
  function createActivatedRoute(id: string, componentType: string) {
    return {
      snapshot: {
        paramMap: {
          get: (key: string) => {
            if (key === 'id') return id;
            if (key === 'component') return componentType;
            return null;
          }
        }
      }
    };
  }

  beforeEach(async () => {
    // Create a fake ApiService with spies for each method.
    fakeApiService = {
      singleDough: jasmine.createSpy('singleDough'),
      singleFilling: jasmine.createSpy('singleFilling'),
      singleTopping: jasmine.createSpy('singleTopping'),
      singleCake: jasmine.createSpy('singleCake')
    };

    // Default stub implementations. Individual tests can override if needed.
    fakeApiService.singleDough.and.returnValue(of(fakeDoughData));
    fakeApiService.singleFilling.and.returnValue(of(fakeFillingData));
    fakeApiService.singleTopping.and.returnValue(of(fakeToppingData));
    fakeApiService.singleCake.and.returnValue(of(fakeCakeData));

    await TestBed.configureTestingModule({
      imports: [ShowRecipeComponent, RouterModule.forRoot([])],
      providers: [
        { provide: ApiService, useValue: fakeApiService },
        // Provide a default ActivatedRoute. Tests below will override this provider.
        { provide: ActivatedRoute, useValue: createActivatedRoute('default', 'dough') }
      ]
    }).compileComponents();
  });

  it('should create', () => {
    fixture = TestBed.createComponent(ShowRecipeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should load dough details when route component is "dough"', () => {
    // Override ActivatedRoute with params for a dough.
    TestBed.overrideProvider(ActivatedRoute, { useValue: createActivatedRoute('d1', 'dough') });
    fixture = TestBed.createComponent(ShowRecipeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(fakeApiService.singleDough).toHaveBeenCalledWith('d1');
    expect(component.dough).toEqual(fakeDoughData);
    expect(component.doughQuantity).toEqual(fakeDoughData.quantity);
  });

  it('should load filling details when route component is "filling"', () => {
    // Override ActivatedRoute with params for a filling.
    TestBed.overrideProvider(ActivatedRoute, { useValue: createActivatedRoute('f1', 'filling') });
    fixture = TestBed.createComponent(ShowRecipeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(fakeApiService.singleFilling).toHaveBeenCalledWith('f1');
    expect(component.filling).toEqual(fakeFillingData);
    expect(component.fillingQuantity).toEqual(fakeFillingData.quantity);
  });

  it('should load topping details when route component is "topping"', () => {
    // Override ActivatedRoute with params for a topping.
    TestBed.overrideProvider(ActivatedRoute, { useValue: createActivatedRoute('t1', 'topping') });
    fixture = TestBed.createComponent(ShowRecipeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(fakeApiService.singleTopping).toHaveBeenCalledWith('t1');
    expect(component.topping).toEqual(fakeToppingData);
    expect(component.toppingQuantity).toEqual(fakeToppingData.quantity);
  });

  it('should load cake details and its components when route component is "cake"', () => {
    // Override ActivatedRoute with params for a cake.
    TestBed.overrideProvider(ActivatedRoute, { useValue: createActivatedRoute('c1', 'cake') });
    fixture = TestBed.createComponent(ShowRecipeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    // Verify cake data is fetched.
    expect(fakeApiService.singleCake).toHaveBeenCalledWith('c1');
    expect(component.cake).toEqual(fakeCakeData);

    // Verify that for each component in the cake, the appropriate API call is made.
    expect(fakeApiService.singleDough).toHaveBeenCalledWith('d1');
    expect(fakeApiService.singleFilling).toHaveBeenCalledWith('f1');
    expect(fakeApiService.singleTopping).toHaveBeenCalledWith('t1');

    // Check that componentsToDisplay is populated with the expected items.
    expect(component.componentsToDisplay.length).toBe(3);

    const doughComponent = component.componentsToDisplay.find(item => item.type === 'dough');
    expect(doughComponent).toBeTruthy();
    expect(doughComponent.quantity).toBe(3);
    expect(doughComponent.baseQuantity).toBe(fakeDoughData.quantity);

    // Verify that ingredients and instructions were set from the cake data.
    expect(component.instructions).toBe(fakeCakeData.instructions);
    expect(component.ingredients).toEqual(fakeCakeData.ingredients);
  });
});
