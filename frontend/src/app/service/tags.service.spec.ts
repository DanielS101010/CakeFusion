import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { TagsService } from './tags.service';
import { ApiService } from './api.service';
import { SharedDataService } from './shared-data.service';
import { Tags } from './tags.model';
import { signal } from '@angular/core';

describe('TagsService', () => {
  let service: TagsService;
  let apiServiceSpy: jasmine.SpyObj<ApiService>;
  let sharedDataServiceStub: Partial<SharedDataService>;

  beforeEach(() => {
    sharedDataServiceStub = {
      tags$: of([]),
      refreshTags: jasmine.createSpy('refreshTags')
    };

    apiServiceSpy = jasmine.createSpyObj('ApiService', ['addTag']);

    TestBed.configureTestingModule({
      providers: [
        TagsService,
        { provide: ApiService, useValue: apiServiceSpy },
        { provide: SharedDataService, useValue: sharedDataServiceStub },
      ]
    });
    service = TestBed.inject(TagsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('addTag', () => {
    it('should call apiService.addTag and refresh tags if tagName is non-empty', () => {
      service.tagName = signal('chocolate');
      apiServiceSpy.addTag.and.returnValue(of('1'));

      service.addTag();

      expect(apiServiceSpy.addTag).toHaveBeenCalledWith('chocolate');
      expect(sharedDataServiceStub.refreshTags).toHaveBeenCalled();
    });

    it('should not call apiService.addTag if tagName is empty', () => {
      service.tagName = signal('');
      service.addTag();

      expect(apiServiceSpy.addTag).not.toHaveBeenCalled();
      expect(sharedDataServiceStub.refreshTags).not.toHaveBeenCalled();
    });
  });

  describe('addTagToComponent', () => {
    it('should add an existing tag to componentTags if not already present', (done) => {
      const existingTag: Tags = { _id: '1', name: 'chocolate' };
      service.tags = signal([existingTag]);
      let componentTags: Tags[] = [];

      service.addTagToComponent('chocolate', componentTags).subscribe(resultTags => {
        expect(resultTags.length).toBe(1);
        expect(resultTags[0]).toEqual(existingTag);
        done();
      });
    });

    it('should not add a duplicate if tag already exists in componentTags', (done) => {
      const existingTag: Tags = { _id: '1', name: 'chocolate' };
      service.tags = signal([existingTag]);
      let componentTags: Tags[] = [existingTag];

      service.addTagToComponent('chocolate', componentTags).subscribe(resultTags => {
        expect(resultTags.length).toBe(1);
        done();
      });
    });

    it('should create and add a new tag if not already existing in service.tags', (done) => {
      service.tags = signal([]);
      let componentTags: Tags[] = [];
      const newTagName = 'NewTag';
      const newTagId = '2';

      apiServiceSpy.addTag.and.returnValue(of(newTagId));

      service.addTagToComponent(newTagName, componentTags).subscribe(resultTags => {
        expect(apiServiceSpy.addTag).toHaveBeenCalledWith(newTagName);
        expect(resultTags.length).toBe(1);
        expect(resultTags[0]).toEqual({ _id: newTagId, name: newTagName });
        expect(service.tags().length).toBe(1);
        expect(service.tags()[0]).toEqual({ _id: newTagId, name: newTagName });
        done();
      });
    });
  });

  describe('deleteTagFromComponent', () => {
    it('should remove the tag from componentTags by tagId', () => {
      const tag1: Tags = { _id: '1', name: 'chocolate' };
      const tag2: Tags = { _id: '2', name: 'nut' };
      const componentTags: Tags[] = [tag1, tag2];

      const updatedTags = service.deleteTagFromComponent('1', componentTags);

      expect(updatedTags.length).toBe(1);
      expect(updatedTags).toEqual([tag2]);
    });
  });
});
