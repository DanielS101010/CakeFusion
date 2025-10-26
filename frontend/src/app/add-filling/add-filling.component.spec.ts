import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';

import { AddFillingComponent } from './add-filling.component';
import { ApiService } from '../service/api.service';
import { SharedDataService } from '../service/shared-data.service';
import { TagsService } from '../service/tags.service';
import { Tags } from '../service/tags.model';
import { signal } from '@angular/core';

describe('AddFillingComponent with mocks', () => {
  let component: AddFillingComponent;
  let fixture: ComponentFixture<AddFillingComponent>;

  let apiServiceMock: jasmine.SpyObj<ApiService>;
  let sharedDataServiceMock: jasmine.SpyObj<SharedDataService>;
  let routerMock: jasmine.SpyObj<Router>;
  let tagsServiceMock: jasmine.SpyObj<TagsService>;

  beforeEach(async () => {
    apiServiceMock = jasmine.createSpyObj('ApiService', ['addFilling']);
    sharedDataServiceMock = jasmine.createSpyObj('SharedDataService', ['refreshFillings'], { tags$: of([]) });
    routerMock = jasmine.createSpyObj('Router', ['navigate']);
    tagsServiceMock = jasmine.createSpyObj('TagsService', ['addTagToComponent', 'deleteTagFromComponent']);

    await TestBed.configureTestingModule({
      imports: [AddFillingComponent],
      providers: [
        { provide: ApiService, useValue: apiServiceMock },
        { provide: SharedDataService, useValue: sharedDataServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: TagsService, useValue: tagsServiceMock }

      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AddFillingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should alert if required fields are missing and not call addFilling', () => {
    spyOn(window, 'alert');
    component.fillingName = signal(''); 
    component.fillingIngredients = signal('75g Almonds, 20g Sugar');
    component.fillingInstructions = signal('Mix well');

    component.addFilling();

    expect(window.alert).toHaveBeenCalledWith('Fülle alle benötigten Felder aus.');
    expect(apiServiceMock.addFilling).not.toHaveBeenCalled();
  });

  it('should call apiService.addFilling and navigate on success', () => {
    component.fillingName = signal('Test Filling');
    component.fillingIngredients = signal('75g Almonds, 20g Sugar');
    component.fillingInstructions = signal('Mix well');
    component.fillingQuantity = signal(1);
    component.fillingTags = signal([]);

    apiServiceMock.addFilling.and.returnValue(of({}));

    component.addFilling();

    expect(apiServiceMock.addFilling).toHaveBeenCalledWith(
      'Test Filling',
      '75g Almonds, 20g Sugar',
      'Mix well',
      1,
      [],
      
    );
    expect(sharedDataServiceMock.refreshFillings).toHaveBeenCalled();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should log error on API failure', () => {
    component.fillingName = signal('Test Filling');
    component.fillingIngredients = signal('75g Almonds, 20g Sugar');
    component.fillingInstructions = signal('Mix well');
    component.fillingQuantity = signal(1);
    component.fillingTags = signal([]);

    apiServiceMock.addFilling.and.returnValue(throwError(() => new Error('API error')));
    const consoleSpy = spyOn(console, 'log');

    component.addFilling();

    expect(consoleSpy).toHaveBeenCalledWith(jasmine.any(Error));
  });

  it('should call tagsService.addTagToComponent and update fillingsTags when newTagName is not empty', () => {
    const newTag: Tags = { _id: '1', name: 'New Tag' };
    component.newTagName = signal('New Tag');
    
    tagsServiceMock.addTagToComponent.and.returnValue(of([newTag]));

    component.addTagToFilling();

    expect(tagsServiceMock.addTagToComponent).toHaveBeenCalledWith('New Tag', []);
    expect(component.fillingTags()).toEqual([newTag]);
  });


  it('should not call tagsService.addTagToComponent if newTagName is empty', () => {
    component.newTagName = signal('');

    component.addTagToFilling();

    expect(tagsServiceMock.addTagToComponent).not.toHaveBeenCalled();
  });


  it('should update fillingTags when deleteTagFromFilling is called', () => {
    component.fillingTags = signal([
      { _id: '1', name: 'Tag1' },
      { _id: '2', name: 'Tag2' }
    ]);

    tagsServiceMock.deleteTagFromComponent.and.callFake((id: string, tags: Tags[]) => 
      tags.filter(tag => tag._id !== id)
    );

    component.deleteTagFromFilling('1');

    expect(tagsServiceMock.deleteTagFromComponent).toHaveBeenCalledWith('1', [
      { _id: '1', name: 'Tag1' },
      { _id: '2', name: 'Tag2' }
    ]);
    expect(component.fillingTags()).toEqual([{ _id: '2', name: 'Tag2' }]);
  });
});
