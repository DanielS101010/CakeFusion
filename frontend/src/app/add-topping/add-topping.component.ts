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

  addTagToTopping(): void {
     if (this.newTagName !== "") {
      this.tagsService.addTagToComponent(this.newTagName, this.toppingTags)
        .subscribe(updatedTags => {
          this.toppingTags = updatedTags;
      });
    }
  }

  deleteTagFromTopping(id: string): void {
    this.toppingTags = this.tagsService.deleteTagFromComponent(id, this.toppingTags)
  }
}
