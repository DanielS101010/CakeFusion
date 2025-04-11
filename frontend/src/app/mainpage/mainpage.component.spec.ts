import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { MainpageComponent } from './mainpage.component';
import { ApiService } from '../service/api.service';
import { SharedDataService } from '../service/shared-data.service';
import { Component, EventEmitter, Output } from '@angular/core';
import { NgFor } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-filter',
  standalone: true,
  template: ''
})
export class FilterComponentStub {
  @Output() filterChanged = new EventEmitter<string[]>();
}

describe('MainpageComponent', () => {
  let component: MainpageComponent;
  let fixture: ComponentFixture<MainpageComponent>;
  let apiServiceSpy: jasmine.SpyObj<ApiService>;
  let sharedDataServiceSpy: jasmine.SpyObj<SharedDataService>;

  beforeEach(async () => {
    apiServiceSpy = jasmine.createSpyObj('ApiService', [
      'deleteDough',
      'deleteFilling',
      'deleteTopping',
      'deleteCake'
    ]);
    sharedDataServiceSpy = jasmine.createSpyObj(
      'SharedDataService',
      ['refreshDoughs', 'refreshFillings', 'refreshToppings', 'refreshCakes', 'refreshTags'],
      {
        doughs$: of([]),
        fillings$: of([]),
        toppings$: of([]),
        cakes$: of([])
      }
    );

    await TestBed.configureTestingModule({
      imports: [MainpageComponent, FilterComponentStub],
      providers: [
        { provide: ApiService, useValue: apiServiceSpy },
        { provide: SharedDataService, useValue: sharedDataServiceSpy }
      ]
    }).overrideComponent(MainpageComponent, {
      set: {
        imports: [FilterComponentStub, NgFor, RouterLink]
      }
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should subscribe to sharedDataService observables on init', () => {
    expect(component.doughs).toEqual([]);
    expect(component.fillings).toEqual([]);
    expect(component.toppings).toEqual([]);
    expect(component.cakes).toEqual([]);
  });

  describe('delete methods', () => {
    it('should delete dough and refresh doughs', () => {
      apiServiceSpy.deleteDough.and.returnValue(of({}));
      component.deleteDough('d1');
      expect(apiServiceSpy.deleteDough).toHaveBeenCalledWith('d1');
      expect(sharedDataServiceSpy.refreshDoughs).toHaveBeenCalled();
    });

    it('should delete filling and refresh fillings', () => {
      apiServiceSpy.deleteFilling.and.returnValue(of({}));
      component.deleteFilling('f1');
      expect(apiServiceSpy.deleteFilling).toHaveBeenCalledWith('f1');
      expect(sharedDataServiceSpy.refreshFillings).toHaveBeenCalled();
    });

    it('should delete topping and refresh toppings', () => {
      apiServiceSpy.deleteTopping.and.returnValue(of({}));
      component.deleteTopping('t1');
      expect(apiServiceSpy.deleteTopping).toHaveBeenCalledWith('t1');
      expect(sharedDataServiceSpy.refreshToppings).toHaveBeenCalled();
    });

    it('should delete cake and refresh cakes', () => {
      apiServiceSpy.deleteCake.and.returnValue(of({}));
      component.deleteCake('c1');
      expect(apiServiceSpy.deleteCake).toHaveBeenCalledWith('c1');
      expect(sharedDataServiceSpy.refreshCakes).toHaveBeenCalled();
    });

    it('should log an error if deleteDough fails', () => {
      const error = new Error('delete error');
      apiServiceSpy.deleteDough.and.returnValue(throwError(() => error));
      spyOn(console, 'error');
      component.deleteDough('d1');
      expect(console.error).toHaveBeenCalledWith(error);
    });
  });

  describe('filter functions', () => {
    beforeEach(() => {
      component.doughs = [
        {
          _id: 'd1', name: 'Dough 1', tags: ['1'],
          ingredients: [],
          instructions: '',
          quantity: 0
        },
        {
          _id: 'd2', name: 'Dough 2', tags: ['2'],
          ingredients: [],
          instructions: '',
          quantity: 0
        },
        {
          _id: 'd3', 
          name: 'Dough 3', 
          tags: ['1', '3'],
          ingredients: [],
          instructions: '',
          quantity: 0
        }
      ];
    });

    it('should filter doughs correctly', () => {
      component.selectedTags = ['1'];
      component.applyFilters();
      expect(component.filteredDoughs).toEqual([
        { _id: 'd1',
          name: 'Dough 1', 
          tags: ['1'],
          ingredients: [],
          instructions: '',
          quantity: 0
        },
        {
          _id: 'd3', 
          name: 'Dough 3', 
          tags: ['1', '3'],
          ingredients: [],
          instructions: '',
          quantity: 0
        }
      ]);
    });

    it('should filter doughs correctly', () => {
      component.selectedTags = ['1', '3'];
      component.applyFilters();
      expect(component.filteredDoughs).toEqual([
        { _id: 'd3', 
          name: 'Dough 3', 
          tags: ['1', '3'],
          ingredients: [],
          instructions: '',
          quantity: 0 },
      ]);
    });

    it('should reset filtered arrays when no tags are selected', () => {
      component.doughs = [
        {
          _id: 'd1',
          name: 'Dough 1',
          ingredients: [],
          instructions: '',
          quantity: 0,
          tags: ['1'],
        }
      ];
      component.fillings = [
        {
          _id: 'f1',
          name: 'Filling 1',
          ingredients: [],
          instructions: '',
          quantity: 0,
          tags: []
        }
      ];
      component.toppings = [
        {
          _id: 't1',
          name: 'Topping 1',
          ingredients: [],
          instructions: '',
          quantity: 0,
          tags: [],
        }
      ];
      component.cakes = [
        {
          _id: 'c1', name: 'Cake 1',
          components: [],
          ingredients: [],
          instructions: '',
          tags: []
        }
      ];

      component.onFilterChanged([]);
      expect(component.filteredDoughs).toEqual(component.doughs);
      expect(component.filteredFillings).toEqual(component.fillings);
      expect(component.filteredToppings).toEqual(component.toppings);
      expect(component.filteredCakes).toEqual(component.cakes);
    });

    it('should update selectedTags and call applyFilters when onFilterChanged is called with non-empty array', () => {
      spyOn(component, 'applyFilters');
      component.onFilterChanged(['1']);
      expect(component.selectedTags).toEqual(['1']);
      expect(component.applyFilters).toHaveBeenCalled();
    });
  });
});
