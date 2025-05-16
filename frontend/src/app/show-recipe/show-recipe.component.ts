import { Component, signal } from '@angular/core';
import { ApiService } from '../service/api.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Dough } from '../add-dough/dough.model';
import { NgFor, NgIf } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { Filling } from '../add-filling/filling.model';
import { Topping } from '../add-topping/topping.model';
import { Cake } from '../add-cake/cake.model';
import { FormsModule } from '@angular/forms';

import { Ingredient } from '../add-cake/cake.model';

@Component({
    selector: 'app-show-recipe',
    imports: [NgIf, NgFor, MatCardModule, RouterLink, FormsModule],
    templateUrl: './show-recipe.component.html',
    styleUrl: './show-recipe.component.css'
})
export class ShowRecipeComponent {
  dough = signal<Dough | null>(null);
  filling = signal<Filling| null>(null);
  topping = signal<Topping| null>(null);
  cake = signal<Cake| null>(null);
 

  doughs = signal<Dough[]>([]);
  fillings = signal<Filling[]>([]);
  toppings = signal<Topping[]>([]);
  componentsToDisplay = signal<any[]>([]);
  
  doughQuantity = signal(1);
  fillingQuantity = signal(1);
  toppingQuantity = signal(1);
  cakeQuantity = signal(1);

  ingredients = signal<Ingredient[]>([]);
  instructions = signal("");

  constructor(private apiService: ApiService, private route: ActivatedRoute){}
  id!: string;
  component!: string;
  
  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id')!;
    this.component = this.route.snapshot.paramMap.get('component')!;
    
    if(this.component === "dough"){
      this.apiService.singleDough(this.id).subscribe((data: Dough) => {
        this.dough.set(data);
        this.doughQuantity.set(data.quantity);
      });
    }
    else if(this.component==="filling"){
      this.apiService.singleFilling(this.id).subscribe((data: Filling) => {
        this.filling.set(data);
        this.fillingQuantity.set(data.quantity);
      });
    }
    else if(this.component==="topping"){
      this.apiService.singleTopping(this.id).subscribe((data: Topping) => {
        this.topping.set(data);
        this.toppingQuantity.set(data.quantity);
      });
    }
    else if(this.component==="cake"){
      this.apiService.singleCake(this.id).subscribe((data: Cake) => {
          this.cake.set(data);
          data.components.forEach((componentItem) => {
            if (componentItem.type === 'dough') {
              this.apiService.singleDough(componentItem.id).subscribe((doughData) => {
                this.componentsToDisplay.update(list => [...list, {...doughData, type: 'dough', baseQuantity: doughData.quantity, quantity: componentItem.quantity}]);
              });
            } else if (componentItem.type === 'filling') {
              this.apiService.singleFilling(componentItem.id).subscribe((fillingData) => {
                this.componentsToDisplay.update(list => [...list, {...fillingData, type: 'dough', baseQuantity: fillingData.quantity, quantity: componentItem.quantity}]);
              });
            } else if (componentItem.type === 'topping') {
              this.apiService.singleTopping(componentItem.id).subscribe((toppingData) => {
                this.componentsToDisplay.update(list => [...list, {...toppingData, type: 'dough', baseQuantity: toppingData.quantity, quantity: componentItem.quantity}]);
              });
            }
          });
          this.ingredients.set(data.ingredients); 
          this.instructions.set(data.instructions);
        });
      }
  }
}