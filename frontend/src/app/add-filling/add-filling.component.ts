import { Component } from '@angular/core';
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
  standalone: true,
  imports: [FormsModule, TextFieldModule, NgFor],
  templateUrl: './add-filling.component.html',
  styleUrl: './add-filling.component.css'
})

export class AddFillingComponent {
  fillingName = "";
  fillingIngredients = "";
  fillingInstructions = "";
  fillingQuantity = 1;
  newTagName = "";
  tags: Tags[] = [];
  fillingTags: Tags[] = [];

  constructor(private apiServie: ApiService, private sharedDataService: SharedDataService, private router: Router, private tagsService: TagsService){}
  
  addFilling(){
    if (this.fillingName == "" || this.fillingIngredients == "" || this.fillingInstructions == ""){
      alert("Fülle alle benötigten Felder aus.")
      return;
    }
    const tagIds = this.fillingTags.map(tag => tag._id);

    this.apiServie.addFilling(this.fillingName, this.fillingIngredients, this.fillingInstructions, this.fillingQuantity, tagIds)
    .subscribe({next:() => {
      this.sharedDataService.refreshFillings();
      this.router.navigate(['/']);

    },
      error: (err) => console.log(err)
    });
  }
  addTagToFilling(): void {
    if (this.newTagName !== "") {
    this.tagsService.addTagToComponent(this.newTagName, this.fillingTags)
      .subscribe((updatedTags: any) => {
        this.fillingTags = updatedTags;
      });
    }
  }

  deleteTagFromFilling(id: string): void {
    this.fillingTags = this.tagsService.deleteTagFromComponent(id, this.fillingTags)
  }
}
