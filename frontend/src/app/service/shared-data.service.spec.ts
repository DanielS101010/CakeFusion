import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { SharedDataService } from './shared-data.service';
import { ApiService } from './api.service';
import { Dough } from '../add-dough/dough.model';
import { Filling } from '../add-filling/filling.model';
import { Topping } from '../add-topping/topping.model';
import { Cake } from '../add-cake/cake.model';
import { Tags } from './tags.model';

describe('SharedDataService', () => {
  let service: SharedDataService;
  let apiServiceSpy: jasmine.SpyObj<ApiService>;

  const testDoughs: Dough[] = [{
    _id: '1',
    name: 'Test Dough',
    ingredients: [{ quantity: 1, description: 'Flour' }],
    instructions: 'Mix thoroughly',
    quantity: 10,
    tags: ["1", "2"],
    image: ''
  }];

  const testFillings: Filling[] = [{
    _id: '1',
    name: 'Test Filling',
    ingredients: [{ quantity: 1, description: 'Chocolate' }],
    instructions: 'Blend well',
    quantity: 5,
    tags: [],
    image: ''
  }];

  const testToppings: Topping[] = [{
    _id: '1',
    name: 'Test Topping',
    ingredients: [{ quantity: 1, description: 'Sprinkles' }],
    instructions: 'Sprinkle on top',
    quantity: 15,
    tags: [],
  }];

  const testCakes: Cake[] = [{
    _id: '1',
    name: 'Test Cake',
    ingredients: [{ quantity: 1, description: 'Test Ingredients' }],
    instructions: 'Bake at 350°F for 30 minutes',
    components: [{ type: 'dough', id: '1', quantity: 1 }],
    tags: []
  }];

  const testTags: Tags[] = [{
    _id: '1',
    name: "Tag1"
  }]

  beforeEach(() => {
    const spy = jasmine.createSpyObj('ApiService', [
      'allDoughs',
      'allFillings',
      'allToppings',
      'allCakes',
      'allTags',
    ]);

    spy.allDoughs.and.returnValue(of(testDoughs));
    spy.allFillings.and.returnValue(of(testFillings));
    spy.allToppings.and.returnValue(of(testToppings));
    spy.allCakes.and.returnValue(of(testCakes));
    spy.allTags.and.returnValue(of(testTags))

    TestBed.configureTestingModule({
      providers: [
        SharedDataService,
        { provide: ApiService, useValue: spy }
      ]
    });

    service = TestBed.inject(SharedDataService);
    apiServiceSpy = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load doughs on initialization', (done: DoneFn) => {
    service.doughs$.subscribe(doughs => {
      expect(doughs).toEqual(testDoughs);
      done();
    });
  });

  it('should refresh doughs', (done: DoneFn) => {
    const newDoughs: Dough[] = [{
      _id: '2',
      name: 'New Dough',
      ingredients: [{ quantity: 2, description: 'Sugar' }],
      instructions: 'Stir well',
      quantity: 20,
      tags: ["1", "2"],
      image: ''
    }];
    apiServiceSpy.allDoughs.and.returnValue(of(newDoughs));
    service.refreshDoughs();

    service.doughs$.subscribe(doughs => {
      expect(doughs).toEqual(newDoughs);
      done();
    });
  });

  it('should load fillings on initialization', (done: DoneFn) => {
    service.fillings$.subscribe(fillings => {
      expect(fillings).toEqual(testFillings);
      done();
    });
  });

  it('should refresh fillings', (done: DoneFn) => {
    const newFillings: Filling[] = [{
      _id: '2',
      name: 'New Filling',
      ingredients: [{ quantity: 3, description: 'Strawberry' }],
      instructions: 'Mix well',
      quantity: 8,
      tags: [],
      image: ''
    }];
    apiServiceSpy.allFillings.and.returnValue(of(newFillings));
    service.refreshFillings();

    service.fillings$.subscribe(fillings => {
      expect(fillings).toEqual(newFillings);
      done();
    });
  });

  it('should load toppings on initialization', (done: DoneFn) => {
    service.toppings$.subscribe(toppings => {
      expect(toppings).toEqual(testToppings);
      done();
    });
  });

  it('should refresh toppings', (done: DoneFn) => {
    const newToppings: Topping[] = [{
      _id: '2',
      name: 'New Topping',
      ingredients: [{ quantity: 2, description: 'Nuts' }],
      instructions: 'Garnish on top',
      quantity: 12,
      tags: []
    }];
    apiServiceSpy.allToppings.and.returnValue(of(newToppings));
    service.refreshToppings();

    service.toppings$.subscribe(toppings => {
      expect(toppings).toEqual(newToppings);
      done();
    });
  });

  it('should load cakes on initialization', (done: DoneFn) => {
    service.cakes$.subscribe(cakes => {
      expect(cakes).toEqual(testCakes);
      done();
    });
  });

  it('should refresh cakes', (done: DoneFn) => {
    const newCakes: Cake[] = [{
      _id: '2',
      name: 'New Cake',
      ingredients: [{ quantity: 1, description: 'New Ingredients' }],
      instructions: 'Bake for 40 minutes',
      components: [],
      tags: []
    }];
    apiServiceSpy.allCakes.and.returnValue(of(newCakes));
    service.refreshCakes();

    service.cakes$.subscribe(cakes => {
      expect(cakes).toEqual(newCakes);
      done();
    });
  });

  it('should load tags on initialization', (done: DoneFn) => {
    service.tags$.subscribe(tags => {
      expect(tags).toEqual(testTags);
      done();
    });
  });

  it('should refresh tags', (done: DoneFn) => {
    const newTags: Tags[] = [{
      _id: '2',
      name: 'Tag 2',
    }];
    apiServiceSpy.allTags.and.returnValue(of(newTags));
    service.refreshTags();

    service.tags$.subscribe(tags => {
      expect(tags).toEqual(newTags);
      done();
    });
  });

  it('should load tags on initialization', (done: DoneFn) => {
    service.tags$.subscribe(tags => {
      expect(tags).toEqual(testTags);
      done();
    });
  });

  it('should refresh tags', (done: DoneFn) => {
    const newTags: Tags[] = [{
      _id: '2',
      name: 'New Tag',
      
    }];
    apiServiceSpy.allTags.and.returnValue(of(newTags));
    service.refreshTags();

    service.tags$.subscribe(tags => {
      expect(tags).toEqual(newTags);
      done();
    });
  });
});
