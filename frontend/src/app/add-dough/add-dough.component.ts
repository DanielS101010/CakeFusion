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
    imports: [FormsModule, TextFieldModule, NgFor],
    templateUrl: './add-dough.component.html',
    styleUrl: './add-dough.component.css'
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
  
  /**
   * adds a dough with name, ingredients, instructions, quantity and tagIds. 
   * Refresh doughs and navigate to the mainpage after successfull saving.
   * If name, ingredients or instructions are empty, it shows a error message and doesnt save the dough.
   */
    addDough(){
    if (this.doughName == "" || this.doughIngredients == "" || this.doughInstructions == ""){
      alert("Fülle alle benötigten Felder aus.")
      return;
    }

    const tagIds = this.doughTags.map(tag => tag._id);
    this.apiService.addDough(this.doughName, this.doughIngredients, this.doughInstructions, this.doughQuantity, tagIds)
    .subscribe({next:() => {
        this.sharedDataService.refreshDoughs();
        this.router.navigate(['/']);
    },
    error: (err) => console.log(err)
    });
  }

  /**
   * adds a tag to doughTags with calling the Function addTagToComponent when the variable newTagName is not empty.
   */
  addTagToDough(): void {
     if (this.newTagName !== "") {
      this.tagsService.addTagToComponent(this.newTagName, this.doughTags)
        .subscribe(updatedTags => {
          this.doughTags = updatedTags;
      });
    }
  }

  /**
   * deletes a tag from the doughTags with calling the function deleteTagFromComponent.
   * @param id id of the tag to delete.
   */
  deleteTagFromDough(id: string): void {
    this.doughTags = this.tagsService.deleteTagFromComponent(id, this.doughTags)
  }
}
