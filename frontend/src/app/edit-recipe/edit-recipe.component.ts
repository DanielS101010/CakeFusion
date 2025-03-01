import { Component } from '@angular/core';
import { Filling } from '../add-filling/filling.model';
import { Cake } from '../add-cake/cake.model';
import { ActivatedRoute, Router } from '@angular/router';
import { Dough } from '../add-dough/dough.model';
import { Topping } from '../add-topping/topping.model';
import { ApiService } from '../api.service';
import { MatCardModule } from '@angular/material/card';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedDataService } from '../shared-data.service';

@Component({
  selector: 'app-edit-recipe',
  standalone: true,
  imports: [MatCardModule, NgFor, NgIf, FormsModule],
  templateUrl: './edit-recipe.component.html',
  styleUrls: ['./edit-recipe.component.css']  
})
export class EditRecipeComponent {
  dough!: Dough;
  filling!: Filling;
  topping!: Topping;
  cake!: Cake;
 
  doughName = "";
  doughIngredients = "";
  doughInstructions = "";
  doughQuantity!: number;

  fillingName = "";
  fillingIngredients = "";
  fillingInstructions = "";
  fillingQuantity!: number;


  toppingName = "";
  toppingIngredients = "";
  toppingInstructions = "";
  toppingQuantity!: number;


  cakeName = "";
  selectedComponents: Array<{ type: string; id: string }> = [];
  cakeUseComponents = "";
  cakeIngredients = "";
  cakeInstructions = "";

  doughs: Dough[] = [];
  fillings: Filling[] = [];
  toppings: Topping[] = [];
  
  id!: string;
  component!: string;

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private sharedDataService: SharedDataService,
    private router: Router
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
        this.doughInstructions = data.instruction;
        this.doughQuantity = data.quantity;
      });
    } else if (this.component === "filling") {
      this.apiService.singleFilling(this.id).subscribe((data: Filling) => {
        this.filling = data;
        this.fillingName = data.name;
        this.fillingIngredients = data.ingredients
          .map((ing: any) => `${ing.quantity} ${ing.description}`)
          .join('\n');
        this.fillingInstructions = data.instruction;
        this.fillingQuantity = data.quantity
      });
    } else if (this.component === "topping") {
      this.apiService.singleTopping(this.id).subscribe((data: Topping) => {
        this.topping = data;
        this.toppingName = data.name;
        this.toppingIngredients = Array.isArray(data.ingredients)
          ? data.ingredients.map((ing: any) => `${ing.quantity} ${ing.description}`).join('\n')
          : data.ingredients;
        this.toppingInstructions = data.instruction;
        this.toppingQuantity = data.quantity
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
      });
    }
  }

  private convertIngredients(ingredientsStr: string) {
    return ingredientsStr.split('\n').map(line => {
      const trimmedLine = line.trim();
      const regex = /^(\d+(?:\.\d+)?)(.*)$/;
      const match = trimmedLine.match(regex);
      if (match) {
        return { quantity: parseFloat(match[1]), description: match[2].trim() };
      }
      return { quantity: 0, description: trimmedLine };
    });
  }

  saveEdit() {
    
    if (this.component === "dough") {
      const ingredientList = this.convertIngredients(this.doughIngredients);
      const ingredientString = ingredientList.map(ing => `${ing.quantity} ${ing.description}`).join('\n');

      this.apiService.updateDough(
        this.id,
        this.doughName,
        ingredientString,
        this.doughInstructions,
        this.doughQuantity
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

      this.apiService.updateFilling(
        this.id,
        this.fillingName,
        ingredientString,
        this.fillingInstructions,
        this.fillingQuantity
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

      this.apiService.updateTopping(
        this.id,
        this.toppingName,
        ingredientString,
        this.toppingInstructions,
        this.toppingQuantity,
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

      this.apiService.updateCake(
        this.id,
        this.cakeName,
        ingredientString,
        this.cakeInstructions,
        this.selectedComponents
      ).subscribe({
        next: () => {
          this.sharedDataService.refreshCakes();
          this.router.navigate(['/']);
        },
        error: err => console.log(err)
      });
    }
  }

  isComponentSelected(type: string, id: string): boolean {
    return this.selectedComponents.some(component => component.type === type && component.id === id);
  }
  
  onComponentChange(type: string, id: string, event: any): void {
    if (event.target.checked) {
      this.selectedComponents.push({ type, id });
    } else {
      this.selectedComponents = this.selectedComponents.filter(c => !(c.type === type && c.id === id));
    }
    this.cakeUseComponents = this.selectedComponents.length === 0 ? "no" : "yes";
  }

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

  moveUp(index: number) {
    if (index === 0) return;
    [this.selectedComponents[index - 1], this.selectedComponents[index]] =
      [this.selectedComponents[index], this.selectedComponents[index - 1]];
  }
  
  moveDown(index: number) {
    if (index === this.selectedComponents.length - 1) return;
    [this.selectedComponents[index], this.selectedComponents[index + 1]] =
      [this.selectedComponents[index + 1], this.selectedComponents[index]];
  }
}
