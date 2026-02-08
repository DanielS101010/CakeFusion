import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';

import { AddToppingComponent } from './add-topping.component';
import { ApiService } from '../service/api.service';
import { SharedDataService } from '../service/shared-data.service';
import { TagsService } from '../service/tags.service';
import { Tags } from '../service/tags.model';
import { signal } from '@angular/core';

describe('AddToppingComponent with mocks', () => {
  let component: AddToppingComponent;
  let fixture: ComponentFixture<AddToppingComponent>;

  let apiServiceMock: jasmine.SpyObj<ApiService>;
  let sharedDataServiceMock: jasmine.SpyObj<SharedDataService>;
  let routerMock: jasmine.SpyObj<Router>;
  let tagsServiceMock: jasmine.SpyObj<TagsService>;

  beforeEach(async () => {
    apiServiceMock = jasmine.createSpyObj('ApiService', ['addTopping']);
    sharedDataServiceMock = jasmine.createSpyObj('SharedDataService', ['refreshToppings'], { tags$: of([]) });
    routerMock = jasmine.createSpyObj('Router', ['navigate']);
    tagsServiceMock = jasmine.createSpyObj('TagsService', ['addTagToComponent', 'deleteTagFromComponent']);

    await TestBed.configureTestingModule({
      imports: [AddToppingComponent],
      providers: [
        { provide: ApiService, useValue: apiServiceMock },
        { provide: SharedDataService, useValue: sharedDataServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: TagsService, useValue: tagsServiceMock },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AddToppingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should alert if required fields are missing and not call addTopping', () => {
    spyOn(window, 'alert');
    component.toppingName = signal(''); 
    component.toppingIngredients = signal('100g chocolate, 50ml cream');
    component.toppingInstructions = signal('Mix well');
    component.toppingQuantity = signal(1);
    component.toppingTags = signal([]);

    component.addTopping();

    expect(window.alert).toHaveBeenCalledWith('Fülle alle benötigten Felder aus.');
    expect(apiServiceMock.addTopping).not.toHaveBeenCalled();
  });

  it('should call apiService.addTopping and navigate on success', () => {
    component.toppingName = signal('Test Topping');
    component.toppingIngredients = signal('100g chocolate, 50ml cream');
    component.toppingInstructions = signal('Mix thoroughly');
    component.toppingQuantity = signal(1);
    component.tags = signal([]);

    apiServiceMock.addTopping.and.returnValue(of({}));

    component.addTopping();

    expect(apiServiceMock.addTopping).toHaveBeenCalledWith(
      'Test Topping',
      '100g chocolate, 50ml cream',
      'Mix thoroughly',
      1,
      [],
      '',
    );
    expect(sharedDataServiceMock.refreshToppings).toHaveBeenCalled();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should log error on API failure', () => {
    component.toppingName = signal('Test Topping');
    component.toppingIngredients = signal('100g chocolate, 50ml cream');
    component.toppingInstructions = signal('Mix thoroughly');
    component.toppingQuantity = signal(1);
    component.tags = signal([]);

    apiServiceMock.addTopping.and.returnValue(throwError(() => new Error('API error')));
    const consoleSpy = spyOn(console, 'log');

    component.addTopping();

    expect(consoleSpy).toHaveBeenCalledWith(jasmine.any(Error));
  });

  it('should call tagsService.addTagToComponent and update toppingsTags when newTagName is not empty', () => {
      const newTag: Tags = { _id: '1', name: 'New Tag' };
      component.newTagName = signal('New Tag');
      
      tagsServiceMock.addTagToComponent.and.returnValue(of([newTag]));
  
      component.addTagToTopping();
  
      expect(tagsServiceMock.addTagToComponent).toHaveBeenCalledWith('New Tag', []);
      expect(component.toppingTags()).toEqual([newTag]);
    });
  
  
    it('should not call tagsService.addTagToComponent if newTagName is empty', () => {
      component.newTagName = signal('');
  
      component.addTagToTopping();
  
      expect(tagsServiceMock.addTagToComponent).not.toHaveBeenCalled();
    });
  
  
    it('should update toppingTags when deleteTagFromTopping is called', () => {
      component.toppingTags = signal([
        { _id: '1', name: 'Tag1' },
        { _id: '2', name: 'Tag2' }
      ]);
  
      tagsServiceMock.deleteTagFromComponent.and.callFake((id: string, tags: Tags[]) => 
        tags.filter(tag => tag._id !== id)
      );
  
      component.deleteTagFromTopping('1');
  
      expect(tagsServiceMock.deleteTagFromComponent).toHaveBeenCalledWith('1', [
        { _id: '1', name: 'Tag1' },
        { _id: '2', name: 'Tag2' }
      ]);
      expect(component.toppingTags()).toEqual([{ _id: '2', name: 'Tag2' }]);
    });
});
