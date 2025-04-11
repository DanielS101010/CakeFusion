import { Component } from '@angular/core';
import { ApiService } from '../service/api.service';
import { FormsModule } from '@angular/forms';
import { SharedDataService } from '../service/shared-data.service';
import { Router } from '@angular/router'; 
import { TextFieldModule } from '@angular/cdk/text-field';
import { NgFor } from '@angular/common';
import { Tags } from '../service/tags.model';
import { TagsService } from '../service/tags.service';

@Component({
  selector: 'app-add-dough',
  standalone: true,
  imports: [FormsModule, TextFieldModule, NgFor],
  templateUrl: './add-dough.component.html',
  styleUrl: './add-dough.component.css',
})

export class AddDoughComponent {
  doughName = "";
  doughIngredients = "";
  doughInstructions = "";
  doughQuantity = 1 ;
  doughTags: Tags[] = [];
  tags: Tags[] = [];
  newTagName = "";

  constructor(private apiService: ApiService, private sharedDataService: SharedDataService, 
    private router: Router, private tagsService: TagsService){}
  
  addDough(){
    if (this.doughName == "" || this.doughIngredients == "" || this.doughInstructions == ""){
      alert("Fülle alle benötigten Felder aus.")
      return;
    }

    const tagIds = this.doughTags.map(tag => tag._id);
    this.apiService.addDough(this.doughName, this.doughIngredients, this.doughInstructions, this.doughQuantity, tagIds).subscribe({next:() => {
    this.sharedDataService.refreshDoughs();
    this.router.navigate(['/']);
    },
    error: (err) => console.log(err)
    });
  }

  addTagToDough(): void {
     if (this.newTagName !== "") {
      this.tagsService.addTagToComponent(this.newTagName, this.doughTags)
        .subscribe(updatedTags => {
          this.doughTags = updatedTags;
      });
    }
  }

  deleteTagFromDough(id: string): void {
    this.doughTags = this.tagsService.deleteTagFromComponent(id, this.doughTags)
  }
}
