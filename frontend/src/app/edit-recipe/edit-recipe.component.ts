import { Component, signal } from '@angular/core';
import { Filling } from '../add-filling/filling.model';
import { Cake } from '../add-cake/cake.model';
import { ActivatedRoute, Router } from '@angular/router';
import { Dough } from '../add-dough/dough.model';
import { Topping } from '../add-topping/topping.model';
import { ApiService } from '../service/api.service';
import { MatCardModule } from '@angular/material/card';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedDataService } from '../service/shared-data.service';
import {TextFieldModule} from '@angular/cdk/text-field';
import { Tags } from '../service/tags.model';
import { TagsService } from '../service/tags.service';
import { ImageService } from '../service/image.service';

@Component({
    selector: 'app-edit-recipe',
    imports: [MatCardModule, NgFor, NgIf, FormsModule, TextFieldModule],
    templateUrl: './edit-recipe.component.html',
    styleUrls: ['./edit-recipe.component.css']
})
export class EditRecipeComponent {
  dough = signal<Dough>({_id: '', name: '', ingredients: [], instructions: '', quantity: 0, tags: [], image: ''});
  filling = signal<Filling>({
    _id: '', name: '', ingredients: [], instructions: '', quantity: 0, tags: [],
    image: ''
  });
  topping = signal<Topping>({_id: '', name: '', ingredients: [], instructions: '', quantity: 0, tags: []});
  cake = signal<Cake>({_id: '', name: '', components: [], ingredients: [], instructions: '', tags: []});

  tags = signal<Tags[]>([]);
  newTagName = signal("");
 
  doughName = signal("");
  doughIngredients = signal("");
  doughInstructions = signal("");
  doughQuantity = signal<number>(1);
  doughTags = signal<Tags[]>([]);
  doughTagsIds = signal<string[]>([]);
  
  fillingName = signal("");
  fillingIngredients = signal("");
  fillingInstructions = signal("");
  fillingQuantity = signal<number>(1);
  fillingTags = signal<Tags[]>([]);
  fillingTagsIds = signal<string[]>([]);

  toppingName = signal("");
  toppingIngredients = signal("");
  toppingInstructions =  signal("");
  toppingQuantity = signal<number>(1);
  toppingTags = signal<Tags[]>([]);
  toppingTagsIds = signal<string[]>([]);

  cakeName = signal("");
  selectedComponents = signal<Array<{ type: string; id: string; quantity: number}>> ([]);

  cakeUseComponents =  signal("");
  cakeIngredients =  signal("");
  cakeInstructions =  signal("");
  cakeTags = signal<Tags[]>([]);
  cakeTagsIds = signal<string[]>([]);

  doughs =  signal<Dough[]>([]);
  fillings =  signal<Filling[]>([]);
  toppings = signal<Topping[]>([]);
  doughImagePreview = signal("");
  doughBase64Output = signal("");
  doughImage: File | undefined;
  fillingImagePreview = signal("");
  fillingBase64Output = signal("");
  fillingImage: File | undefined;
  toppingImagePreview = signal("");
  toppingBase64Output = signal("");
  toppingImage: File | undefined;
  cakeImagePreview = signal("");
  cakeBase64Output = signal("");
  cakeImage: File | undefined;
  
  id = signal("");
  component = signal("");

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private sharedDataService: SharedDataService,
    private router: Router,
    private tagsService: TagsService,
    private imageService: ImageService
  ) {}

  ngOnInit() {
    this.id.set(this.route.snapshot.paramMap.get('id')!);
    this.component.set(this.route.snapshot.paramMap.get('component')!);
    if (this.component() === "dough") {
      this.apiService.singleDough(this.id()).subscribe((data: Dough) => {
        this.dough.set(data);
        this.doughName.set(data.name);
        this.doughIngredients.set(data.ingredients
          .map(ing => `${ing.quantity} ${ing.description}`)
          .join('\n'));
        this.doughInstructions.set(data.instructions);
        this.doughQuantity.set(data.quantity);
        this.doughTagsIds.set(data.tags);
        this.doughBase64Output.set(data.image ?? "");
        this.doughImagePreview.set(this.imageService.toDataUrl(data.image ?? ''));

        this.sharedDataService.tags$.subscribe((allTags: Tags[]) => {
          this.doughTags.set(allTags.filter(tag => this.doughTagsIds().includes(tag._id)));
        });
      });
    } else if (this.component() === "filling") {
      this.apiService.singleFilling(this.id()).subscribe((data: Filling) => {
        this.filling.set(data);
        this.fillingName.set(data.name);
        this.fillingIngredients.set(data.ingredients
          .map((ing: any) => `${ing.quantity} ${ing.description}`)
          .join('\n'));
        this.fillingInstructions.set(data.instructions);
        this.fillingQuantity.set(data.quantity);
        this.fillingTagsIds.set(data.tags);
        this.fillingBase64Output.set(data.image ?? "");
        this.fillingImagePreview.set(this.imageService.toDataUrl(data.image ?? ''));

        this.sharedDataService.tags$.subscribe((allTags: Tags[]) => {
          this.fillingTags.set(allTags.filter(tag => this.fillingTagsIds().includes(tag._id)));
        });
      });
    } else if (this.component() === "topping") {
      this.apiService.singleTopping(this.id()).subscribe((data: Topping) => {
        this.topping.set(data);
        this.toppingName.set(data.name);
        this.toppingIngredients.set(Array.isArray(data.ingredients)
          ? data.ingredients.map((ing: any) => `${ing.quantity} ${ing.description}`).join('\n')
          : data.ingredients);
        this.toppingInstructions.set(data.instructions);
        this.toppingQuantity.set(data.quantity);
        this.toppingTagsIds.set(data.tags);
        this.toppingBase64Output.set(data.image ?? "");
        this.toppingImagePreview.set(this.imageService.toDataUrl(data.image ?? ''));

        this.sharedDataService.tags$.subscribe((allTags: Tags[]) => {
          this.toppingTags.set(allTags.filter(tag => this.toppingTagsIds().includes(tag._id)));
        });

      });
    } else if (this.component() === "cake") {
      this.apiService.singleCake(this.id()).subscribe((data: Cake) => {
        this.cake.set(data);
        this.cakeName.set(data.name);
        this.cakeBase64Output.set(data.image ?? "");
        this.cakeImagePreview.set(this.imageService.toDataUrl(data.image ?? ''));

        this.cakeIngredients.set(Array.isArray(data.ingredients)
          ? data.ingredients.map((ing: any) => `${ing.quantity} ${ing.description}`).join('\n')
          : data.ingredients);
        this.cakeInstructions.set(data.instructions);

        this.sharedDataService.doughs$.subscribe(doughs => this.doughs.set(doughs));
        this.sharedDataService.fillings$.subscribe(fillings => this.fillings.set(fillings));
        this.sharedDataService.toppings$.subscribe(toppings => this.toppings.set(toppings));

        this.selectedComponents.set(data.components || []);
        this.cakeUseComponents.set(this.selectedComponents().length > 0 ? "yes" : "no");
        this.cakeTagsIds.set(data.tags);

        this.sharedDataService.tags$.subscribe((allTags: Tags[]) => {
          this.cakeTags.set(allTags.filter(tag => this.cakeTagsIds().includes(tag._id)));
        });
      });
    }
  }

  /**
   * converts the ingredientsstring into seperated values in quantity and description
   * @param ingredientsStr a string with the ingredients
   * @returns returns the values quantity and description
   */
  private convertIngredients(ingredientsStr: string) {
    return ingredientsStr.split('\n').map(line => {
      const trimmedLine = line.trim();
      const regex = /^(\d+(?:[.,]\d+)?)(.*)$/;
      const match = trimmedLine.match(regex);
      if (match) {
        return { quantity: parseFloat(match[1]), description: match[2].trim() };
      }
      return { quantity: 0, description: trimmedLine };
    });
  }

  /**
   * saves the edited component. 
   */
  saveEdit() {
    if (this.component() === "dough") {
      const ingredientList = this.convertIngredients(this.doughIngredients());
      const ingredientString = ingredientList.map(ing => `${ing.quantity} ${ing.description}`).join('\n');

      const tagIds = this.doughTags().map(tag => tag._id);

      this.apiService.updateDough(
        this.id(),
        this.doughName(),
        ingredientString,
        this.doughInstructions(),
        this.doughQuantity(),
        tagIds,
        this.doughBase64Output()
      ).subscribe({
        next: () => {
          this.sharedDataService.refreshDoughs();
          this.router.navigate(['Rezept/' + this.id() + "/" + this.component()]);
        },
        error: err => console.log(err)
      });
    } else if (this.component() === "filling") {
      const ingredientList = this.convertIngredients(this.fillingIngredients());
      const ingredientString = ingredientList.map(ing => `${ing.quantity} ${ing.description}`).join('\n');
    
      const tagIds = this.fillingTags().map(tag => tag._id);

      this.apiService.updateFilling(
        this.id(),
        this.fillingName(),
        ingredientString,
        this.fillingInstructions(),
        this.fillingQuantity(),
        tagIds,
        this.fillingBase64Output()
      ).subscribe({
        next: () => {
          this.sharedDataService.refreshFillings();
          this.router.navigate(['Rezept/' + this.id() + "/" + this.component()]);
        },
        error: err => console.log(err)
      });
    } else if (this.component() === "topping") {
      const ingredientList = this.convertIngredients(this.toppingIngredients());
      const ingredientString = ingredientList.map(ing => `${ing.quantity} ${ing.description}`).join('\n');

      const tagIds = this.toppingTags().map(tag => tag._id);

      this.apiService.updateTopping(
        this.id(),
        this.toppingName(),
        ingredientString,
        this.toppingInstructions(),
        this.toppingQuantity(),
        tagIds,
        this.toppingBase64Output()
      ).subscribe({
        next: () => {
          this.sharedDataService.refreshToppings();
          this.router.navigate(['Rezept/' + this.id() + "/" + this.component()]);
        },
        error: err => console.log(err)
      });
    } else if (this.component() === "cake") {
      const ingredientList = this.convertIngredients(this.cakeIngredients());
      const ingredientString = ingredientList.map(ing => `${ing.quantity} ${ing.description}`).join('\n');
      
      const tagIds = this.cakeTags().map(tag => tag._id);

      this.apiService.updateCake(
        this.id(),
        this.cakeName(),
        ingredientString,
        this.cakeInstructions(),
        this.selectedComponents(),
        tagIds,
        this.cakeBase64Output()
      ).subscribe({
        next: () => {
          this.sharedDataService.refreshCakes();
          this.router.navigate(['/']);
        },
        error: err => console.log(err)
      });
    }
  }

  /**
   * 
   * @param type type of component
   * @param id id of the component
   * @returns boolean, if selected then true, if not selected, untrue
   */
  isComponentSelected(type: string, id: string): boolean {
    return this.selectedComponents().some(component => component.type === type && component.id === id);
  }
  
  /**
   * adds or delete a component from the selected components
   * @param type type of component
   * @param id id of the component
   * @param event clickevent on a checkbox
   */
  onComponentChange(type: string, id: string, event: any): void {
    if (event.target.checked) {
      this.selectedComponents().push({ type, id, quantity:1});
    } else {
      this.selectedComponents.update(components => components.filter(c => !(c.type === type && c.id === id)));
    }
    }

  /**
   * this function returns the name of the component.
   * @param type type of the component. should be dough, filling or topping
   * @param id id of the component
   * @returns returns the component name, if existing
   */
  getComponentName(type: string, id: string): string {
    switch (type) {
      case 'dough':
        const dough = this.doughs().find(d => d._id === id);
        return dough ? dough.name : 'Unbekannter Teig';
      case 'filling':
        const filling = this.fillings().find(f => f._id === id);
        return filling ? filling.name : 'Unbekannte Füllung';
      case 'topping':
        const topping = this.toppings().find(t => t._id === id);
        return topping ? topping.name : 'Unbekannter Topping';
      default:
        return 'Unbekannte Komponente';
    }
  }

  /**
   * move component one position up in selectedComponents
   * @param index position number
   */
  moveUp(index: number) {
    if (index === 0) return;
    [this.selectedComponents()[index - 1], this.selectedComponents()[index]] =
      [this.selectedComponents()[index], this.selectedComponents()[index - 1]];
  }
  
  /**
   * move component one position down in selectedComponents
   * @param index position number
   */
  moveDown(index: number) {
    if (index === this.selectedComponents().length - 1) return;
    [this.selectedComponents()[index], this.selectedComponents()[index + 1]] =
      [this.selectedComponents()[index + 1], this.selectedComponents()[index]];
  }

  /**
   * adds a tag to the componentTags with calling the Function addTagToComponent when the variable newTagName is not empty.
   * @param component cpmponent type
   */
  addTag(component: string): void {
    if (this.newTagName() !== "") {
      if(component==="dough"){
        this.tagsService.addTagToComponent(this.newTagName(), this.doughTags())
        .subscribe(updatedTags => {
          this.doughTags.set(updatedTags);
        });
      }else if( component==="filling"){
        this.tagsService.addTagToComponent(this.newTagName(), this.fillingTags())
        .subscribe(updatedTags => {
          this.fillingTags.set(updatedTags);
        });
      }else if(component==="topping"){
        this.tagsService.addTagToComponent(this.newTagName(), this.toppingTags())
        .subscribe(updatedTags => {
          this.toppingTags.set(updatedTags);
        });
      }else if(component==="cake"){
        this.tagsService.addTagToComponent(this.newTagName(), this.cakeTags())
        .subscribe(updatedTags => {
          this.cakeTags.set(updatedTags);
        });
      }
    }
  }

  onDoughFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement | null;
    const file = input?.files?.[0];
    this.doughImage = file ?? undefined;

    if (!file) {
      this.clearDoughImage(input ?? undefined);
      return;
    }

    this.imageService.readFileAsDataUrl(file)
      .then(dataUrl => {
        this.doughImagePreview.set(dataUrl);
        this.doughBase64Output.set(this.imageService.extractBase64Payload(dataUrl));
      })
      .catch(error => console.error('File conversion failed', error));
  }

  onFillingFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement | null;
    const file = input?.files?.[0];
    this.fillingImage = file ?? undefined;

    if (!file) {
      this.clearFillingImage(input ?? undefined);
      return;
    }

    this.imageService.readFileAsDataUrl(file)
      .then(dataUrl => {
        this.fillingImagePreview.set(dataUrl);
        this.fillingBase64Output.set(this.imageService.extractBase64Payload(dataUrl));
      })
      .catch(error => console.error('File conversion failed', error));
  }

  onToppingFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement | null;
    const file = input?.files?.[0];
    this.toppingImage = file ?? undefined;

    if (!file) {
      this.clearToppingImage(input ?? undefined);
      return;
    }

    this.imageService.readFileAsDataUrl(file)
      .then(dataUrl => {
        this.toppingImagePreview.set(dataUrl);
        this.toppingBase64Output.set(this.imageService.extractBase64Payload(dataUrl));
      })
      .catch(error => console.error('File conversion failed', error));
  }

  onCakeFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement | null;
    const file = input?.files?.[0];
    this.cakeImage = file ?? undefined;

    if (!file) {
      this.clearCakeImage(input ?? undefined);
      return;
    }

    this.imageService.readFileAsDataUrl(file)
      .then(dataUrl => {
        this.cakeImagePreview.set(dataUrl);
        this.cakeBase64Output.set(this.imageService.extractBase64Payload(dataUrl));
      })
      .catch(error => console.error('File conversion failed', error));
  }

  clearDoughImage(fileInput?: HTMLInputElement): void {
    this.doughImage = undefined;
    this.doughImagePreview.set("");
    this.doughBase64Output.set("");
    this.imageService.resetFileInput(fileInput);
  }

  clearFillingImage(fileInput?: HTMLInputElement): void {
    this.fillingImage = undefined;
    this.fillingImagePreview.set("");
    this.fillingBase64Output.set("");
    this.imageService.resetFileInput(fileInput);
  }

  clearToppingImage(fileInput?: HTMLInputElement): void {
    this.toppingImage = undefined;
    this.toppingImagePreview.set("");
    this.toppingBase64Output.set("");
    this.imageService.resetFileInput(fileInput);
  }

  clearCakeImage(fileInput?: HTMLInputElement): void {
    this.cakeImage = undefined;
    this.cakeImagePreview.set("");
    this.cakeBase64Output.set("");
    this.imageService.resetFileInput(fileInput);
  }

  /**
   * deletes a tag from the componentTags with calling the function deleteTagFromComponent.
   * @param id id of the tag
   * @param component cimponent type
   */
  deleteTag(id: string, component: string): void {
    if(component==="dough"){
      this.doughTags.set(this.tagsService.deleteTagFromComponent(id, this.doughTags()));
    }else if( component==="filling"){
      this.fillingTags.set(this.tagsService.deleteTagFromComponent(id, this.fillingTags()));
    }else if(component==="topping"){
      this.toppingTags.set(this.tagsService.deleteTagFromComponent(id, this.toppingTags()));
    }else if(component==="cake"){
      this.cakeTags.set(this.tagsService.deleteTagFromComponent(id, this.cakeTags()));
    }
  }
}
