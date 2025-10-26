import { Component, computed, signal } from '@angular/core';
import { ApiService } from '../service/api.service';
import { FormsModule } from '@angular/forms';
import { SharedDataService } from '../service/shared-data.service';
import { Router } from '@angular/router';
import { TextFieldModule } from '@angular/cdk/text-field';
import { Tags } from '../service/tags.model';
import { TagsService } from '../service/tags.service';
import { NgFor, NgIf } from '@angular/common';
import { ImageService } from '../service/image.service';

@Component({
    selector: 'app-add-topping',
    imports: [FormsModule, TextFieldModule, NgFor, NgIf],
    templateUrl: './add-topping.component.html',
    styleUrl: './add-topping.component.css'
})
export class AddToppingComponent {
  toppingName = signal("");
  toppingIngredients = signal("");
  toppingInstructions = signal("");
  toppingQuantity = signal(1);
  newTagName = signal("");
  tags = signal<Tags[]>([]);
  toppingTags = signal<Tags[]>([]);
  base64Output = "";
  previewSrc = "";
  image: File | undefined;

  constructor(private apiServie: ApiService, private sharedDataService: SharedDataService, private router: Router, private tagsService: TagsService, private imageService: ImageService){}

  /**
   * adds a topping with name, ingredients, instructions, quantity and tagIds. 
   * Refresh toppings and navigate to the mainpage after successfull saving.
   * If name, ingredients or instructions are empty, it shows a error message and doesnt save the topping.
   */
  addTopping(){
    if (this.toppingName() == "" || this.toppingIngredients() == "" || this.toppingInstructions() == ""){
      alert("Fülle alle benötigten Felder aus.")
      return;
    }
    const tagIds = computed(() =>   this.toppingTags().map(tag => tag._id))

    this.apiServie.addTopping(this.toppingName(), this.toppingIngredients(), this.toppingInstructions(), this.toppingQuantity(), tagIds()).subscribe({next:() => {
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
    if (this.newTagName() !== "") {
      this.tagsService.addTagToComponent(this.newTagName(), this.toppingTags())
        .subscribe(updatedTags => {
          this.toppingTags.set(updatedTags);
      });
    }
  }

  /**
   * deletes a tag from the doughTags with calling the function deleteTagFromComponent.
   * @param id id of the tag to delete.
   */
  deleteTagFromTopping(id: string): void {
    this.toppingTags.set(this.tagsService.deleteTagFromComponent(id, this.toppingTags()))
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
