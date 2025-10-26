import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';

import { AddDoughComponent } from './add-dough.component';
import { ApiService } from '../service/api.service';
import { SharedDataService } from '../service/shared-data.service';
import { TagsService } from '../service/tags.service';
import { Tags } from '../service/tags.model';
import { signal } from '@angular/core';

describe('AddDoughComponent with mocks', () => {
  let component: AddDoughComponent;
  let fixture: ComponentFixture<AddDoughComponent>;

  let apiServiceMock: jasmine.SpyObj<ApiService>;
  let sharedDataServiceMock: jasmine.SpyObj<SharedDataService>;
  let routerMock: jasmine.SpyObj<Router>;
  let tagsServiceMock: jasmine.SpyObj<TagsService>;

  beforeEach(async () => {
    apiServiceMock = jasmine.createSpyObj('ApiService', ['addDough']);
    sharedDataServiceMock = jasmine.createSpyObj('SharedDataService', ['refreshDoughs'], { tags$: of([]) });
    routerMock = jasmine.createSpyObj('Router', ['navigate']);
    tagsServiceMock = jasmine.createSpyObj('TagsService', ['addTagToComponent', 'deleteTagFromComponent']);

    await TestBed.configureTestingModule({
      imports: [AddDoughComponent],
      providers: [
        { provide: ApiService, useValue: apiServiceMock },
        { provide: SharedDataService, useValue: sharedDataServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: TagsService, useValue: tagsServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AddDoughComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });


  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should alert if required fields are missing and not call addDough', () => {
    spyOn(window, 'alert');
    component.doughName = signal(''); 
    component.doughIngredients = signal('200g Flour, 50ml Water');
    component.doughInstructions = signal('Mix well');
    component.doughTags = signal([]);

    component.addDough();

    expect(window.alert).toHaveBeenCalledWith('Fülle alle benötigten Felder aus.');
    expect(apiServiceMock.addDough).not.toHaveBeenCalled();
  });

  it('should call apiService.addDough and navigate on success', () => {
    component.doughName = signal('Test Dough');
    component.doughIngredients = signal('200g Flour, 50ml Water');
    component.doughInstructions = signal('Mix well');
    component.doughQuantity = signal(2);
    component.doughTags = signal([]);

    apiServiceMock.addDough.and.returnValue(of({}));

    component.addDough();

    expect(apiServiceMock.addDough).toHaveBeenCalledWith(
      'Test Dough',
      '200g Flour, 50ml Water',
      'Mix well',
      2,
      [],
      ""
    );
    expect(sharedDataServiceMock.refreshDoughs).toHaveBeenCalled();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should log error on API failure', () => {
    component.doughName = signal('Test Dough');
    component.doughIngredients = signal('200g Flour, 50ml Water');
    component.doughInstructions = signal('Mix well');
    component.doughQuantity = signal(1)
    component.doughTags = signal([]);

    apiServiceMock.addDough.and.returnValue(throwError(() => new Error('API error')));
    const consoleSpy = spyOn(console, 'log');

    component.addDough();

    expect(consoleSpy).toHaveBeenCalledWith(jasmine.any(Error));
  });

  it('should call tagsService.addTagToComponent and update doughTags when newTagName is not empty', () => {
    const newTag: Tags = { _id: '1', name: 'New Tag' };
    component.newTagName = signal('New Tag');
    
    tagsServiceMock.addTagToComponent.and.returnValue(of([newTag]));

    component.addTagToDough();

    expect(tagsServiceMock.addTagToComponent).toHaveBeenCalledWith('New Tag', []);
    expect(component.doughTags()).toEqual([newTag]);
  });


  it('should not call tagsService.addTagToComponent if newTagName is empty', () => {
    component.newTagName = signal('');

    component.addTagToDough();

    expect(tagsServiceMock.addTagToComponent).not.toHaveBeenCalled();
  });


  it('should update doughTags when deleteTagFromDough is called', () => {
    component.doughTags = signal([
      { _id: '1', name: 'Tag1' },
      { _id: '2', name: 'Tag2' }
    ]);

    tagsServiceMock.deleteTagFromComponent.and.callFake((id: string, tags: Tags[]) => 
      tags.filter(tag => tag._id !== id)
    );

    component.deleteTagFromDough('1');

    expect(tagsServiceMock.deleteTagFromComponent).toHaveBeenCalledWith('1', [
      { _id: '1', name: 'Tag1' },
      { _id: '2', name: 'Tag2' }
    ]);
    expect(component.doughTags()).toEqual([{ _id: '2', name: 'Tag2' }]);
  });
});
