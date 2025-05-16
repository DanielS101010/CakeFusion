import { Component, computed, signal } from '@angular/core';
import { ApiService } from '../service/api.service';
import { FormsModule } from '@angular/forms';
import { SharedDataService } from '../service/shared-data.service';
import { Router } from '@angular/router';
import { TextFieldModule } from '@angular/cdk/text-field';
import { TagsService } from '../service/tags.service';
import { Tags } from '../service/tags.model';
import { NgFor } from '@angular/common';

@Component({
    selector: 'app-add-filling',
    imports: [FormsModule, TextFieldModule, NgFor],
    templateUrl: './add-filling.component.html',
    styleUrl: './add-filling.component.css'
})

export class AddFillingComponent {
  fillingName = signal("");
  fillingIngredients = signal("");
  fillingInstructions = signal("")
  fillingQuantity = signal(1);
  newTagName = signal("");
  tags = signal<Tags[]>([]);
  fillingTags = signal<Tags[]>([]);

  constructor(private apiServie: ApiService, private sharedDataService: SharedDataService, private router: Router, private tagsService: TagsService){}
  
   /**
   * adds a filling with name, ingredients, instructions, quantity and tagIds. 
   * Refresh fillings and navigate to the mainpage after successfull saving.
   * If name, ingredients or instructions are empty, it shows a error message and doesnt save the filling.
   */
  addFilling(){
    if (this.fillingName() == "" || this.fillingIngredients() == "" || this.fillingInstructions() == ""){
      alert("Fülle alle benötigten Felder aus.")
      return;
    }
    const tagIds = computed(() =>   this.fillingTags().map(tag => tag._id))

    this.apiServie.addFilling(this.fillingName(), this.fillingIngredients(), this.fillingInstructions(), this.fillingQuantity(), tagIds())
    .subscribe({next:() => {
      this.sharedDataService.refreshFillings();
      this.router.navigate(['/']);

    },
      error: (err) => console.log(err)
    });
  }

  /**
   * adds a tag to fillingTags with calling the Function addTagToComponent when the variable newTagName is not empty.
   */
  addTagToFilling(): void {
    if (this.newTagName() !== "") {
    this.tagsService.addTagToComponent(this.newTagName(), this.fillingTags())
      .subscribe((updatedTags: any) => {
        this.fillingTags.set(updatedTags);
      });
    }
  }

  /**
   * deletes a tag from the fillingTags with calling the function deleteTagFromComponent.
   * @param id id of the tag to delete.
   */
  deleteTagFromFilling(id: string): void {
    this.fillingTags.set(this.tagsService.deleteTagFromComponent(id, this.fillingTags()))
  }
}
