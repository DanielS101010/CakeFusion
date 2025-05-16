import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { FilterComponent } from './filter.component';
import { SharedDataService } from '../service/shared-data.service';
import { signal } from '@angular/core';

interface Tags {
  _id: string;
  name: string;
}

describe('FilterComponent', () => {
  let component: FilterComponent;
  let fixture: ComponentFixture<FilterComponent>;
  let sharedDataServiceMock: jasmine.SpyObj<SharedDataService>;

  const mockTags: Tags[] = [
    { _id: 'tag1', name: 'Tag 1' },
    { _id: 'tag2', name: 'Tag 2' }
  ];

  beforeEach(async () => {
    sharedDataServiceMock = jasmine.createSpyObj('SharedDataService', ['refreshTags'], {
      tags$: of(mockTags)
    });

    await TestBed.configureTestingModule({
      imports: [FilterComponent],
      providers: [
        { provide: SharedDataService, useValue: sharedDataServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add a tag to selectedTags and emit event when checkbox is checked', () => {
    spyOn(component.filterChanged, 'emit');
    const testTagId = 'tag1';
    const event = { target: { checked: true } };

    component.onChange(event, testTagId);

    expect(component.selectedTags()).toContain(testTagId);
    expect(component.filterChanged.emit).toHaveBeenCalledWith([testTagId]);
  });

  it('should remove a tag from selectedTags and emit event when checkbox is unchecked', () => {
    spyOn(component.filterChanged, 'emit');
    const testTagId = 'tag1';
    component.selectedTags = signal([testTagId]);

    const event = { target: { checked: false } };
    component.onChange(event, testTagId);

    expect(component.selectedTags()).not.toContain(testTagId);
    expect(component.filterChanged.emit).toHaveBeenCalledWith([]);
  });
});
