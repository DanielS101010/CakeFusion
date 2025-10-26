import { Component, computed, signal } from '@angular/core';
import { ApiService } from '../service/api.service';
import { FormsModule } from '@angular/forms';
import { SharedDataService } from '../service/shared-data.service';
import { Router } from '@angular/router'; 
import { TextFieldModule } from '@angular/cdk/text-field';
import { NgFor, NgIf } from '@angular/common';
import { Tags } from '../service/tags.model';
import { TagsService } from '../service/tags.service';
import { ImageService } from '../service/image.service';

@Component({
    selector: 'app-add-dough',
    imports: [FormsModule, TextFieldModule, NgFor, NgIf],
    templateUrl: './add-dough.component.html',
    styleUrl: './add-dough.component.css'
})

export class AddDoughComponent {
  doughName = signal("");
  doughIngredients = signal("");
  doughInstructions = signal("");
  doughQuantity = signal(1);
  doughTags = signal<Tags[]>([]);
  tags = signal<Tags[]>([]);
  newTagName = signal("");
  base64Output = "";
  previewSrc = "";
  image: File | undefined;


  constructor(private apiService: ApiService, private sharedDataService: SharedDataService, 
    private router: Router, private tagsService: TagsService, private imageService: ImageService){}
  
  /**
   * adds a dough with name, ingredients, instructions, quantity and tagIds. 
   * Refresh doughs and navigate to the mainpage after successfull saving.
   * If name, ingredients or instructions are empty, it shows a error message and doesnt save the dough.
   */
    addDough(){
    if (this.doughName() == "" || this.doughIngredients() == "" || this.doughInstructions() == ""){
      alert("Fülle alle benötigten Felder aus.")
      return;
    }

    const tagIds = computed(() =>   this.doughTags().map(tag => tag._id))
    this.apiService.addDough(this.doughName(), this.doughIngredients(), this.doughInstructions(), this.doughQuantity(), tagIds(), this.base64Output)
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
     if (this.newTagName() !== "") {
      this.tagsService.addTagToComponent(this.newTagName(), this.doughTags())
        .subscribe(updatedTags => {
          this.doughTags.set(updatedTags);
      });
    }
  }

  /**
   * deletes a tag from the doughTags with calling the function deleteTagFromComponent.
   * @param id id of the tag to delete.
   */
  deleteTagFromDough(id: string): void {
    this.doughTags.set(this.tagsService.deleteTagFromComponent(id, this.doughTags())); 
  }


  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement | null;
    const file = input?.files?.[0];
    this.image = file;
    
    if (!file) {
      this.clearImage(input ?? undefined);
      return;
    }

    this.imageService.readFileAsDataUrl(file)
      .then(dataUrl => {
        this.previewSrc = dataUrl;
        this.base64Output = this.imageService.extractBase64Payload(dataUrl);
      })
      .catch(error => console.error('File conversion failed', error));
  }

  clearImage(fileInput?: HTMLInputElement): void {
    this.image = undefined;
    this.previewSrc = "";
    this.base64Output = "";
    this.imageService.resetFileInput(fileInput);
  }
}
