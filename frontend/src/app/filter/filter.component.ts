import { NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, Output, computed, signal } from '@angular/core';
import { SharedDataService } from '../service/shared-data.service';
import { Tags } from '../service/tags.model';

@Component({
  selector: 'app-filter',
  imports: [NgFor, NgIf],
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.css'
})
export class FilterComponent {
  @Output() filterChanged = new EventEmitter<string[]>();

  tags = signal<Tags[]>([]);
  selectedTags = signal<string[]>([]);
  selectedCount = computed(() => this.selectedTags().length);

  constructor(private sharedDataService: SharedDataService) {
    this.sharedDataService.tags$.subscribe(tags => {
      this.tags.set(tags);
    });
  }
  /**
   * delete tag if unchecked, else adding it to selectedTags
   * @param event clickevent on checkbox
   * @param id id of the tag
   */
  onChange(event: Event, id: string) {
    const isChecked = (event.target as HTMLInputElement | null)?.checked ?? false;

    if (isChecked) {
      this.selectedTags.update(tags => [...tags, id]);
    } else {
      this.selectedTags.set(this.selectedTags().filter(tag => tag !== id));
    }

    this.filterChanged.emit(this.selectedTags());
  }

  resetFilters() {
    if (!this.selectedTags().length) {
      return;
    }

    this.selectedTags.set([]);
    this.filterChanged.emit([]);
  }

  isTagSelected(tagId: string) {
    return this.selectedTags().includes(tagId);
  }

  trackByTagId(_index: number, tag: Tags) {
    return tag._id;
  }
}
