import { TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';

import { FilterService } from './filter.service';
import { SharedDataService } from './shared-data.service';
import { Dough } from '../add-dough/dough.model';
import { Filling } from '../add-filling/filling.model';
import { Topping } from '../add-topping/topping.model';
import { Cake } from '../add-cake/cake.model';

class SharedDataServiceStub {
  doughsSubject = new BehaviorSubject<Dough[]>([]);
  doughs$ = this.doughsSubject.asObservable();

  fillingsSubject = new BehaviorSubject<Filling[]>([]);
  fillings$ = this.fillingsSubject.asObservable();

  toppingsSubject = new BehaviorSubject<Topping[]>([]);
  toppings$ = this.toppingsSubject.asObservable();

  cakesSubject = new BehaviorSubject<Cake[]>([]);
  cakes$ = this.cakesSubject.asObservable();

  tags$ = new BehaviorSubject([] as never[]).asObservable();
}

describe('FilterService', () => {
  let service: FilterService;
  let sharedDataService: SharedDataServiceStub;

  beforeEach(() => {
    sharedDataService = new SharedDataServiceStub();

    TestBed.configureTestingModule({
      providers: [
        { provide: SharedDataService, useValue: sharedDataService }
      ]
    });
    service = TestBed.inject(FilterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should filter items by selected tags and search term', () => {
    const doughs: Dough[] = [
      { _id: '1', name: 'Chocolate Base', ingredients: [], instructions: '', quantity: 0, tags: ['sweet', 'base'] },
      { _id: '2', name: 'Vanilla Base', ingredients: [], instructions: '', quantity: 0, tags: ['base'] },
      { _id: '3', name: 'Berry Base', ingredients: [], instructions: '', quantity: 0, tags: ['fruit', 'base'] }
    ];

    sharedDataService.doughsSubject.next(doughs);

    expect(service.filteredDoughs()).toEqual(doughs);

    service.setSelectedTags(['base']);
    expect(service.filteredDoughs()).toEqual(doughs);

    service.setSelectedTags(['base', 'sweet']);
    expect(service.filteredDoughs()).toEqual([
      { _id: '1', name: 'Chocolate Base', ingredients: [], instructions: '', quantity: 0, tags: ['sweet', 'base'] }
    ]);

    service.setSearchTerm('berry');
    expect(service.filteredDoughs()).toEqual([]);

    service.setSelectedTags(['base']);
    expect(service.filteredDoughs()).toEqual([
      { _id: '3', name: 'Berry Base', ingredients: [], instructions: '', quantity: 0, tags: ['fruit', 'base'] }
    ]);

    service.setSearchTerm('');
    expect(service.filteredDoughs()).toEqual(doughs);
  });

  it('should filter fillings, toppings and cakes with trimmed search term', () => {
    const fillings: Filling[] = [
      { _id: 'f1', name: 'Summer Berry Cream', ingredients: [], instructions: '', quantity: 0, tags: ['fruit', 'seasonal'] },
      { _id: 'f2', name: 'Dark Chocolate Ganache', ingredients: [], instructions: '', quantity: 0, tags: ['sweet'] }
    ];
    const toppings: Topping[] = [
      { _id: 't1', name: 'Cocoa Dust', ingredients: [], instructions: '', quantity: 0, tags: ['sweet'] },
      { _id: 't2', name: 'Citrus Zest', ingredients: [], instructions: '', quantity: 0, tags: ['fruit', 'fresh'] }
    ];
    const cakes: Cake[] = [
      {
        _id: 'c1',
        name: 'Summer Dream Cake',
        components: [],
        ingredients: [],
        instructions: '',
        tags: ['fruit', 'seasonal']
      },
      {
        _id: 'c2',
        name: 'Midnight Chocolate',
        components: [],
        ingredients: [],
        instructions: '',
        tags: ['sweet']
      }
    ];

    sharedDataService.fillingsSubject.next(fillings);
    sharedDataService.toppingsSubject.next(toppings);
    sharedDataService.cakesSubject.next(cakes);

    service.setSelectedTags(['fruit']);

    expect(service.filteredFillings()).toEqual([
      { _id: 'f1', name: 'Summer Berry Cream', ingredients: [], instructions: '', quantity: 0, tags: ['fruit', 'seasonal'] }
    ]);
    expect(service.filteredToppings()).toEqual([
      { _id: 't2', name: 'Citrus Zest', ingredients: [], instructions: '', quantity: 0, tags: ['fruit', 'fresh'] }
    ]);
    expect(service.filteredCakes()).toEqual([
      {
        _id: 'c1',
        name: 'Summer Dream Cake',
        components: [],
        ingredients: [],
        instructions: '',
        tags: ['fruit', 'seasonal']
      }
    ]);

    service.setSearchTerm('  SUMMER   ');

    expect(service.filteredFillings()).toEqual([
      { _id: 'f1', name: 'Summer Berry Cream', ingredients: [], instructions: '', quantity: 0, tags: ['fruit', 'seasonal'] }
    ]);
    expect(service.filteredCakes()).toEqual([
      {
        _id: 'c1',
        name: 'Summer Dream Cake',
        components: [],
        ingredients: [],
        instructions: '',
        tags: ['fruit', 'seasonal']
      }
    ]);
    expect(service.filteredToppings()).toEqual([]);

    service.setSelectedTags([]);
    service.setSearchTerm('');

    expect(service.filteredFillings()).toEqual(fillings);
    expect(service.filteredToppings()).toEqual(toppings);
    expect(service.filteredCakes()).toEqual(cakes);
  });

  it('should return empty arrays when no items are loaded', () => {
    service.setSelectedTags(['non-existing']);
    service.setSearchTerm('nope');

    expect(service.filteredDoughs()).toEqual([]);
    expect(service.filteredFillings()).toEqual([]);
    expect(service.filteredToppings()).toEqual([]);
    expect(service.filteredCakes()).toEqual([]);
  });
});
