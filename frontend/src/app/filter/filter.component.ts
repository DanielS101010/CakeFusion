import { NgFor } from '@angular/common';
import { Component, EventEmitter, Output, signal } from '@angular/core';
import { SharedDataService } from '../service/shared-data.service';
import { Tags } from '../service/tags.model';

@Component({
    selector: 'app-filter',
    imports: [NgFor],
    templateUrl: './filter.component.html',
    styleUrl: './filter.component.css'
})
export class FilterComponent {
@Output() filterChanged = new EventEmitter<string[]>;


  tags = signal<Tags[]>([]);
  selectedTags = signal<string[]>([]);

  constructor(private sharedDataService: SharedDataService){
    this.sharedDataService.tags$.subscribe(tags => {
      this.tags.set(tags);
    });
  }
  /**
   * delete tag if unchecked, else adding it to selectedTags
   * @param $event clickevent on checkbox
   * @param id id of the tag
   */
  onChange($event: any, id: string){
    if($event.target.checked){
      this.selectedTags.update(tags => {return [...tags, id]})
    }else{
      this.selectedTags.set(this.selectedTags().filter(tag => tag !== id));
    }
    
    this.filterChanged.emit(this.selectedTags())
  }
}
