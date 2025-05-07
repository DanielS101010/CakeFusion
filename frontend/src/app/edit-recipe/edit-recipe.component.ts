import { Component } from '@angular/core';
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

@Component({
    selector: 'app-edit-recipe',
    imports: [MatCardModule, NgFor, NgIf, FormsModule, TextFieldModule],
    templateUrl: './edit-recipe.component.html',
    styleUrls: ['./edit-recipe.component.css']
})
export class EditRecipeComponent {
  dough!: Dough;
  filling!: Filling;
  topping!: Topping;
  cake!: Cake;

  tags: Tags[] = [];
  newTagName = "";
 
  doughName = "";
  doughIngredients = "";
  doughInstructions = "";
  doughQuantity!: number;
  doughTags: Tags[] = [];
  doughTagsIds: string[] = [];
  
  fillingName = "";
  fillingIngredients = "";
  fillingInstructions = "";
  fillingQuantity!: number;
  fillingTags: Tags[] = [];
  fillingTagsIds: string[] = [];

  toppingName = "";
  toppingIngredients = "";
  toppingInstructions = "";
  toppingQuantity!: number;
  toppingTags: Tags[] = [];
  toppingTagsIds: string[] = [];

  cakeName = "";
  selectedComponents: Array<{ type: string; id: string; quantity: number}> = [];
  cakeUseComponents = "";
  cakeIngredients = "";
  cakeInstructions = "";
  cakeTags: Tags[] = [];
  cakeTagsIds: string[] = [];

  doughs: Dough[] = [];
  fillings: Filling[] = [];
  toppings: Topping[] = [];
  
  id!: string;
  component!: string;

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private sharedDataService: SharedDataService,
    private router: Router,
    private tagsService: TagsService
  ) {}

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id')!;
    this.component = this.route.snapshot.paramMap.get('component')!;
    
    if (this.component === "dough") {
      this.apiService.singleDough(this.id).subscribe((data: Dough) => {
        this.dough = data;
        this.doughName = data.name;
        this.doughIngredients = data.ingredients
          .map(ing => `${ing.quantity} ${ing.description}`)
          .join('\n');
        this.doughInstructions = data.instructions;
        this.doughQuantity = data.quantity;
        this.doughTagsIds = data.tags;

        this.sharedDataService.tags$.subscribe((allTags: Tags[]) => {
          this.doughTags = allTags.filter(tag => this.doughTagsIds.includes(tag._id));
        });
      });
    } else if (this.component === "filling") {
      this.apiService.singleFilling(this.id).subscribe((data: Filling) => {
        this.filling = data;
        this.fillingName = data.name;
        this.fillingIngredients = data.ingredients
          .map((ing: any) => `${ing.quantity} ${ing.description}`)
          .join('\n');
        this.fillingInstructions = data.instructions;
        this.fillingQuantity = data.quantity
        this.fillingTagsIds = data.tags;

        this.sharedDataService.tags$.subscribe((allTags: Tags[]) => {
          this.fillingTags = allTags.filter(tag => this.fillingTagsIds.includes(tag._id));
        });
      });
    } else if (this.component === "topping") {
      this.apiService.singleTopping(this.id).subscribe((data: Topping) => {
        this.topping = data;
        this.toppingName = data.name;
        this.toppingIngredients = Array.isArray(data.ingredients)
          ? data.ingredients.map((ing: any) => `${ing.quantity} ${ing.description}`).join('\n')
          : data.ingredients;
        this.toppingInstructions = data.instructions;
        this.toppingQuantity = data.quantity
        this.toppingTagsIds = data.tags;

        this.sharedDataService.tags$.subscribe((allTags: Tags[]) => {
          this.toppingTags = allTags.filter(tag => this.toppingTagsIds.includes(tag._id));
        });

      });
    } else if (this.component === "cake") {
      this.apiService.singleCake(this.id).subscribe((data: Cake) => {
        this.cake = data;
        this.cakeName = data.name;

        this.cakeIngredients = Array.isArray(data.ingredients)
          ? data.ingredients.map((ing: any) => `${ing.quantity} ${ing.description}`).join('\n')
          : data.ingredients;
        this.cakeInstructions = data.instructions;

        this.sharedDataService.doughs$.subscribe(doughs => this.doughs = doughs);
        this.sharedDataService.fillings$.subscribe(fillings => this.fillings = fillings);
        this.sharedDataService.toppings$.subscribe(toppings => this.toppings = toppings);

        this.selectedComponents = data.components || [];
        this.cakeUseComponents = this.selectedComponents.length > 0 ? "yes" : "no";
        this.cakeTagsIds = data.tags;

        this.sharedDataService.tags$.subscribe((allTags: Tags[]) => {
          this.cakeTags = allTags.filter(tag => this.cakeTagsIds.includes(tag._id));
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
    if (this.component === "dough") {
      const ingredientList = this.convertIngredients(this.doughIngredients);
      const ingredientString = ingredientList.map(ing => `${ing.quantity} ${ing.description}`).join('\n');

      const tagIds = this.doughTags.map(tag => tag._id);

      this.apiService.updateDough(
        this.id,
        this.doughName,
        ingredientString,
        this.doughInstructions,
        this.doughQuantity,
        tagIds,
      ).subscribe({
        next: () => {
          this.sharedDataService.refreshDoughs();
          this.router.navigate(['Rezept/' + this.id + "/" + this.component]);
        },
        error: err => console.log(err)
      });
    } else if (this.component === "filling") {
      const ingredientList = this.convertIngredients(this.fillingIngredients);
      const ingredientString = ingredientList.map(ing => `${ing.quantity} ${ing.description}`).join('\n');
    
      const tagIds = this.fillingTags.map(tag => tag._id);

      this.apiService.updateFilling(
        this.id,
        this.fillingName,
        ingredientString,
        this.fillingInstructions,
        this.fillingQuantity,
        tagIds,
      ).subscribe({
        next: () => {
          this.sharedDataService.refreshFillings();
          this.router.navigate(['Rezept/' + this.id + "/" + this.component]);
        },
        error: err => console.log(err)
      });
    } else if (this.component === "topping") {
      const ingredientList = this.convertIngredients(this.toppingIngredients);
      const ingredientString = ingredientList.map(ing => `${ing.quantity} ${ing.description}`).join('\n');

      const tagIds = this.toppingTags.map(tag => tag._id);

      this.apiService.updateTopping(
        this.id,
        this.toppingName,
        ingredientString,
        this.toppingInstructions,
        this.toppingQuantity,
        tagIds,
      ).subscribe({
        next: () => {
          this.sharedDataService.refreshToppings();
          this.router.navigate(['Rezept/' + this.id + "/" + this.component]);
        },
        error: err => console.log(err)
      });
    } else if (this.component === "cake") {
      const ingredientList = this.convertIngredients(this.cakeIngredients);
      const ingredientString = ingredientList.map(ing => `${ing.quantity} ${ing.description}`).join('\n');
      
      const tagIds = this.cakeTags.map(tag => tag._id);

      this.apiService.updateCake(
        this.id,
        this.cakeName,
        ingredientString,
        this.cakeInstructions,
        this.selectedComponents,
        tagIds,
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
    return this.selectedComponents.some(component => component.type === type && component.id === id);
  }
  
  /**
   * adds or delete a component from the selected components
   * @param type type of component
   * @param id id of the component
   * @param event clickevent on a checkbox
   */
  onComponentChange(type: string, id: string, event: any): void {
    if (event.target.checked) {
      this.selectedComponents.push({ type, id, quantity:1});
    } else {
      this.selectedComponents = this.selectedComponents.filter(c => !(c.type === type && c.id === id));
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
        const dough = this.doughs.find(d => d._id === id);
        return dough ? dough.name : 'Unbekannter Teig';
      case 'filling':
        const filling = this.fillings.find(f => f._id === id);
        return filling ? filling.name : 'Unbekannte Füllung';
      case 'topping':
        const topping = this.toppings.find(t => t._id === id);
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
    [this.selectedComponents[index - 1], this.selectedComponents[index]] =
      [this.selectedComponents[index], this.selectedComponents[index - 1]];
  }
  
  /**
   * move component one position down in selectedComponents
   * @param index position number
   */
  moveDown(index: number) {
    if (index === this.selectedComponents.length - 1) return;
    [this.selectedComponents[index], this.selectedComponents[index + 1]] =
      [this.selectedComponents[index + 1], this.selectedComponents[index]];
  }

  /**
   * adds a tag to the componentTags with calling the Function addTagToComponent when the variable newTagName is not empty.
   * @param component cpmponent type
   */
  addTag(component: string): void {
    if (this.newTagName !== "") {
      if(component==="dough"){
        this.tagsService.addTagToComponent(this.newTagName, this.doughTags)
        .subscribe(updatedTags => {
          this.doughTags = updatedTags;
        });
      }else if( component==="filling"){
        this.tagsService.addTagToComponent(this.newTagName, this.fillingTags)
        .subscribe(updatedTags => {
          this.fillingTags = updatedTags;
        });
      }else if(component==="topping"){
        this.tagsService.addTagToComponent(this.newTagName, this.toppingTags)
        .subscribe(updatedTags => {
          this.toppingTags = updatedTags;
        });
      }else if(component==="cake"){
        this.tagsService.addTagToComponent(this.newTagName, this.cakeTags)
        .subscribe(updatedTags => {
          this.cakeTags = updatedTags;
        });
      }
    }
  }

  /**
   * deletes a tag from the componentTags with calling the function deleteTagFromComponent.
   * @param id id of the tag
   * @param component cimponent type
   */
  deleteTag(id: string, component: string): void {
    if(component==="dough"){
      this.doughTags = this.tagsService.deleteTagFromComponent(id, this.doughTags)
    }else if( component==="filling"){
      this.fillingTags = this.tagsService.deleteTagFromComponent(id, this.fillingTags)
    }else if(component==="topping"){
      this.toppingTags = this.tagsService.deleteTagFromComponent(id, this.toppingTags)
    }else if(component==="cake"){
      this.cakeTags = this.tagsService.deleteTagFromComponent(id, this.cakeTags)
    }
  }
}
