import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { MainpageComponent } from './mainpage.component';
import { ApiService } from '../service/api.service';
import { SharedDataService } from '../service/shared-data.service';
import { Component, EventEmitter, Output, signal } from '@angular/core';
import { NgFor } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FilterService } from '../service/filter.service';
import { Dough } from '../add-dough/dough.model';
import { Filling } from '../add-filling/filling.model';
import { Topping } from '../add-topping/topping.model';
import { Cake } from '../add-cake/cake.model';

@Component({
  selector: 'app-filter',
  template: ''
})
export class FilterComponentStub {
  @Output() filterChanged = new EventEmitter<string[]>();
}

class FilterServiceStub {
  filteredDoughs = signal<Dough[]>([]);
  filteredFillings = signal<Filling[]>([]);
  filteredToppings = signal<Topping[]>([]);
  filteredCakes = signal<Cake[]>([]);

  setSelectedTags = jasmine.createSpy('setSelectedTags');
  setSearchTerm = jasmine.createSpy('setSearchTerm');
}

describe('MainpageComponent', () => {
  let component: MainpageComponent;
  let fixture: ComponentFixture<MainpageComponent>;
  let apiServiceSpy: jasmine.SpyObj<ApiService>;
  let sharedDataServiceSpy: jasmine.SpyObj<SharedDataService>;
  let filterServiceStub: FilterServiceStub;

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

    filterServiceStub = new FilterServiceStub();

    await TestBed.configureTestingModule({
      imports: [MainpageComponent, FilterComponentStub],
      providers: [
        { provide: ApiService, useValue: apiServiceSpy },
        { provide: SharedDataService, useValue: sharedDataServiceSpy },
        { provide: FilterService, useValue: filterServiceStub }
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

  it('should expose filtered data from the filter service', () => {
    const doughs: Dough[] = [
      { _id: 'd1', name: 'Dough 1', ingredients: [], instructions: '', quantity: 0, tags: [], image:"" }
    ];
    filterServiceStub.filteredDoughs.set(doughs);
    expect(component.filteredDoughs()).toEqual(doughs);
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
    it('should forward selected tags to the filter service', () => {
      component.onFilterChanged(['a']);
      expect(filterServiceStub.setSelectedTags).toHaveBeenCalledWith(['a']);
    });

    it('should forward empty selections to the filter service', () => {
      component.onFilterChanged([]);
      expect(filterServiceStub.setSelectedTags).toHaveBeenCalledWith([]);
    });
  });
});
