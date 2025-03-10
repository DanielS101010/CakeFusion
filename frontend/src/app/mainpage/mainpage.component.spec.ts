import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { MainpageComponent } from './mainpage.component';
import { ApiService } from '../api.service';
import { SharedDataService } from '../shared-data.service';

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
      ['refreshDoughs', 'refreshFillings', 'refreshToppings', 'refreshCakes'],
      {
        doughs$: of([]),
        fillings$: of([]),
        toppings$: of([]),
        cakes$: of([])
      }
    );

    await TestBed.configureTestingModule({
      imports: [MainpageComponent],
      providers: [
        { provide: ApiService, useValue: apiServiceSpy },
        { provide: SharedDataService, useValue: sharedDataServiceSpy }
      ]
    }).compileComponents();

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
});
