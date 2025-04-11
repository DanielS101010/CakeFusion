import { Component } from '@angular/core';
import { ApiService } from '../service/api.service';
import { FormsModule } from '@angular/forms';
import { SharedDataService } from '../service/shared-data.service';
import { Router } from '@angular/router';
import { TextFieldModule } from '@angular/cdk/text-field';
import { Tags } from '../service/tags.model';
import { TagsService } from '../service/tags.service';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-add-topping',
  standalone: true,
  imports: [FormsModule, TextFieldModule, NgFor],
  templateUrl: './add-topping.component.html',
  styleUrl: './add-topping.component.css'
})
export class AddToppingComponent {
  toppingName = "";
  toppingIngredients = "";
  toppingInstructions = "";
  toppingQuantity = 1;
  newTagName = "";
  tags: Tags[] = [];
  toppingTags: Tags[] = [];

  constructor(private apiServie: ApiService, private sharedDataService: SharedDataService, private router: Router, private tagsService: TagsService){}

  /**
   * adds a topping with name, ingredients, instructions, quantity and tagIds. 
   * Refresh toppings and navigate to the mainpage after successfull saving.
   * If name, ingredients or instructions are empty, it shows a error message and doesnt save the topping.
   */
  addTopping(){
    if (this.toppingName == "" || this.toppingIngredients == "" || this.toppingInstructions == ""){
      alert("Fülle alle benötigten Felder aus.")
      return;
    }
    const tagIds = this.toppingTags.map(tag => tag._id);

    this.apiServie.addTopping(this.toppingName, this.toppingIngredients, this.toppingInstructions, this.toppingQuantity, tagIds).subscribe({next:() => {
      this.sharedDataService.refreshToppings()
      this.router.navigate(['/']);
    },
      error: (err) => console.log(err)
      });
  }

  /**
   * adds a tag to toppingTags with calling the Function addTagToComponent when the variable newTagName is not empty.
   */
  addTagToTopping(): void {
     if (this.newTagName !== "") {
      this.tagsService.addTagToComponent(this.newTagName, this.toppingTags)
        .subscribe(updatedTags => {
          this.toppingTags = updatedTags;
      });
    }
  }

  /**
   * deletes a tag from the doughTags with calling the function deleteTagFromComponent.
   * @param id id of the tag to delete.
   */
  deleteTagFromTopping(id: string): void {
    this.toppingTags = this.tagsService.deleteTagFromComponent(id, this.toppingTags)
  }
}
