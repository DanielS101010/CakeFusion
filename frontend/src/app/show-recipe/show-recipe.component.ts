import { Component, computed, signal } from '@angular/core';
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
import { ImageService } from '../service/image.service';

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
  imageBase64Output: any;
  imagePreview: any;
  readonly doughImage = computed(() => this.dough()?.image ?? '');
  readonly fillingImage = computed(() => this.filling()?.image ?? '');
  readonly toppingImage = computed(() => this.topping()?.image ?? '');
  readonly cakeImage = computed(() => this.cake()?.image ?? '');

  constructor(private apiService: ApiService, private route: ActivatedRoute, private imageService: ImageService,
){}
  id!: string;
  component!: string;
  
  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id')!;
    this.component = this.route.snapshot.paramMap.get('component')!;
    
    if(this.component === "dough"){
      this.apiService.singleDough(this.id).subscribe((data: Dough) => {
        this.dough.set({ ...data, image: this.imageService.toDataUrl(data.image || '') });
        this.doughQuantity.set(data.quantity);
      });
    }
    else if(this.component==="filling"){
      this.apiService.singleFilling(this.id).subscribe((data: Filling) => {
        this.filling.set({ ...data, image: this.imageService.toDataUrl(data.image ?? '') });
        this.fillingQuantity.set(data.quantity);
      });
    }
    else if(this.component==="topping"){
      this.apiService.singleTopping(this.id).subscribe((data: Topping) => {
        this.topping.set({ ...data, image: this.imageService.toDataUrl(data.image ?? '') });
        this.toppingQuantity.set(data.quantity);
      });
    }
    else if(this.component==="cake"){
      this.apiService.singleCake(this.id).subscribe((data: Cake) => {
          this.cake.set({ ...data, image: this.imageService.toDataUrl(data.image ?? '') });
          data.components.forEach((componentItem) => {
            if (componentItem.type === 'dough') {
              this.apiService.singleDough(componentItem.id).subscribe((doughData) => {
                const image = this.imageService.toDataUrl(doughData.image || '');
                this.componentsToDisplay.update(list => [...list, {...doughData, image, type: 'dough', baseQuantity: doughData.quantity, quantity: componentItem.quantity}]);
              });
            } else if (componentItem.type === 'filling') {
              this.apiService.singleFilling(componentItem.id).subscribe((fillingData) => {
                const image = this.imageService.toDataUrl(fillingData.image ?? '');
                this.componentsToDisplay.update(list => [...list, {...fillingData, image, type: 'filling', baseQuantity: fillingData.quantity, quantity: componentItem.quantity}]);
              });
            } else if (componentItem.type === 'topping') {
              this.apiService.singleTopping(componentItem.id).subscribe((toppingData) => {
                const image = this.imageService.toDataUrl(toppingData.image ?? '');
                this.componentsToDisplay.update(list => [...list, {...toppingData, image, type: 'topping', baseQuantity: toppingData.quantity, quantity: componentItem.quantity}]);
              });
            }
          });
          this.ingredients.set(data.ingredients); 
          this.instructions.set(data.instructions);
        });
      }
  }
}
