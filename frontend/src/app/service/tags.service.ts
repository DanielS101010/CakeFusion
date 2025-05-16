import { Injectable, signal } from '@angular/core';
import { ApiService } from './api.service';
import { SharedDataService } from './shared-data.service';
import { Tags } from './tags.model';
import { catchError, map, Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TagsService {
  tagName = signal<string>("");
  tags = signal<Tags[]>([]);


  constructor(private apiService: ApiService, private sharedDataService: SharedDataService){
    this.sharedDataService.tags$.subscribe(tags => {
      this.tags.set(tags);
    });
  }

  addTag(){
    if(this.tagName() !==""){
      this.apiService.addTag(this.tagName()).subscribe({next:() => {
      this.sharedDataService.refreshTags();
      },
      error: (err) => console.log(err)
      });
    };
  }

  addTagToComponent(newTagName:string, componentTags: Tags[]): Observable<Tags[]>{
    const tagName = newTagName.trim();
    const existingTag = this.tags().find(tag => tag.name.toLowerCase() === tagName.toLowerCase());

    if (existingTag){
      if (!componentTags.find(tag => tag._id === existingTag._id)) {
        componentTags.push(existingTag);
      }

      return of(componentTags);
    } else {
      return this.apiService.addTag(tagName).pipe(
        tap((returnedId: string) => {
          const newTag: Tags = { _id: returnedId, name: tagName };
          this.tags.update(tag => [...this.tags(), newTag]);
          componentTags.push(newTag);
        }),
        map(() => componentTags),
        catchError(err => {
          console.log(err);
          return of(componentTags);
        })
      );
    }
  }

  deleteTagFromComponent(tagId: string, componentTags: Tags[]): Tags[]{
    return componentTags.filter(tag => tag._id !== tagId)
  }
}
