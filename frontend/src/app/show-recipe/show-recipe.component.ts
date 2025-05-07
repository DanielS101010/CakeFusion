import { Component } from '@angular/core';
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
  dough!: Dough;
  filling!: Filling;
  topping!: Topping;
  cake!: Cake;
 

  doughs: Dough[] = [];
  fillings: Filling[] = [];
  toppings: Topping[] = [];
  componentsToDisplay: any[] = [];
  
  doughQuantity!: number
  fillingQuantity!: number
  toppingQuantity!: number
  cakeQuantity = 1

  ingredients: Ingredient[] = [];
  instructions = "";

  constructor(private apiService: ApiService, private route: ActivatedRoute){}
  id!: string;
  component!: string;
  
  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id')!;
    this.component = this.route.snapshot.paramMap.get('component')!;
    
    if(this.component === "dough"){
      this.apiService.singleDough(this.id).subscribe((data: Dough) => {
        this.dough = data;
        this.doughQuantity = data.quantity;
      });
    }
    else if(this.component==="filling"){
      this.apiService.singleFilling(this.id).subscribe((data: Filling) => {
        this.filling = data;
        this.fillingQuantity = data.quantity;
      });
    }
    else if(this.component==="topping"){
      this.apiService.singleTopping(this.id).subscribe((data: Topping) => {
        this.topping = data;
        this.toppingQuantity = data.quantity;
      });
    }
    else if(this.component==="cake"){
      this.apiService.singleCake(this.id).subscribe((data: Cake) => {
          this.cake = data;
          data.components.forEach((componentItem) => {
            if (componentItem.type === 'dough') {
              this.apiService.singleDough(componentItem.id).subscribe((doughData) => {
                this.componentsToDisplay.push({ ...doughData, type: 'dough', baseQuantity: doughData.quantity, quantity: componentItem.quantity});
              });
            } else if (componentItem.type === 'filling') {
              this.apiService.singleFilling(componentItem.id).subscribe((fillingData) => {
                this.componentsToDisplay.push({ ...fillingData, type: 'filling', baseQuantity: fillingData.quantity, quantity: componentItem.quantity });
              });
            } else if (componentItem.type === 'topping') {
              this.apiService.singleTopping(componentItem.id).subscribe((toppingData) => {
                this.componentsToDisplay.push({ ...toppingData, type: 'topping', baseQuantity: toppingData.quantity, quantity: componentItem.quantity });
              });
            }
          });
          this.ingredients = data.ingredients 
          this.instructions = data.instructions
        });
      }
  }
}