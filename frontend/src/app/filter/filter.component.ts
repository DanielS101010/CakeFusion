import { NgFor } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { SharedDataService } from '../service/shared-data.service';
import { Tags } from '../service/tags.model';

@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [NgFor],
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.css'
})
export class FilterComponent {
@Output() filterChanged = new EventEmitter<string[]>;


  tags!: Tags[];
  selectedTags: string[] = []

  constructor(private sharedDataService: SharedDataService){
    this.sharedDataService.tags$.subscribe(tags => {
      this.tags = tags;
    });
  }
  onChange($event: any, id: string){
    if($event.target.checked){
      this.selectedTags.push(id)
    }else{
      this.selectedTags = this.selectedTags.filter(tag => tag !== id);
    }
    
    this.filterChanged.emit(this.selectedTags)
  }
}
