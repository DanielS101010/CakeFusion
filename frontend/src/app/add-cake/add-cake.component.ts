import { Component } from '@angular/core';
import { ApiService } from '../service/api.service';
import { FormsModule } from '@angular/forms';
import { SharedDataService } from '../service/shared-data.service';
import { Dough } from '../add-dough/dough.model';
import { Filling } from '../add-filling/filling.model';
import { Topping } from '../add-topping/topping.model';

import { NgFor, NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { TextFieldModule } from '@angular/cdk/text-field';
import { Tags } from '../service/tags.model';
import { TagsService } from '../service/tags.service';

@Component({
  selector: 'app-cake',
  standalone: true,
  imports: [NgFor, NgIf, FormsModule, TextFieldModule],
  templateUrl: './add-cake.component.html',
  styleUrl: './add-cake.component.css'
})
export class CakeComponent {
  doughs: Dough[] = [];
  fillings: Filling[] = [];
  toppings: Topping[] = [];

  cakeName = "";
  selectedComponents: Array<{ type: string; id: string; quantity: number}> = [];

  useComponents = "";
  ingredients = "";
  instructions = "";

  cakeTags: Tags[] = [];
  tags: Tags[] = [];
  newTagName = "";

  constructor(private apiService: ApiService, private sharedDataService: SharedDataService, private router: Router,
    private tagsService: TagsService) {}

  ngOnInit() {
    this.sharedDataService.doughs$.subscribe(doughs => {
      this.doughs = doughs;
    });

    this.sharedDataService.fillings$.subscribe(fillings => {
      this.fillings = fillings;
    });

    this.sharedDataService.toppings$.subscribe(toppings => {
      this.toppings = toppings;
    });
  }

  /**
   * adds or delete a component from the selected components
   * @param event clickevent on a checkbox
   * @param type componenttype
   * @param quantity quantity of the component
   */
  onComponentChange(event: any, type: string, quantity: number) {
    const compId = event.target.value;
    if (event.target.checked) {
      this.selectedComponents.push({ type, id: compId, quantity });
    } else {
      this.selectedComponents = this.selectedComponents.filter(
        (comp) => !(comp.type === type && comp.id === compId)
      );
    }
  }

  /**
   * return true if is checked and false if unchecked
   * @param type component type (dough, filling or topping)
   * @param id id of the component
   * @returns returns a boolean if
   */
  isComponentSelected(type: string, id: string): boolean {
    return this.selectedComponents.some((comp) => comp.type === type && comp.id === id);
  }

  /**
   * add cake to database
   * @returns 
   */
  addCake() {
    if (this.cakeName == "" || this.selectedComponents.length == 0 && (this.ingredients == "" || this.instructions =="" )){
      alert("Fülle alle benötigten Felder aus.")
      return;
    }

    const tagIds = this.cakeTags.map(tag => tag._id);

    this.apiService.addCake(this.cakeName, this.ingredients, this.instructions, this.selectedComponents, tagIds).subscribe({next: () => {
          this.sharedDataService.refreshCakes();
          this.router.navigate(['/']);
        },
        error: (err) => console.log(err),
      });
  }

  /**
   * adds a tag to cakeTags with calling the Function addTagToComponent when the variable newTagName is not empty.
   */
  addTagToCake(): void {
     if (this.newTagName !== "") {
      this.tagsService.addTagToComponent(this.newTagName, this.cakeTags)
        .subscribe(updatedTags => {
          this.cakeTags = updatedTags;
      });
    }
  }

  /**
   * deletes a tag from the cakeTags with calling the function deleteTagFromComponent.
   * @param id id of the tag to delete.
   */
  deleteTagFromCake(id: string): void {
    this.cakeTags = this.tagsService.deleteTagFromComponent(id, this.cakeTags)
  }


  /**
   * this function returns the name of the component.
   * @param type type of the component. should be dough, filling or topping
   * @param id id of the component
   * @returns returns the component name, if existing
   */
  getComponentName(type: string, id: string): string {
    switch(type){
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
  
}
