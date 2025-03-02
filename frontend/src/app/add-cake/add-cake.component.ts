import { Component } from '@angular/core';
import { ApiService } from '../api.service';
import { FormsModule } from '@angular/forms';
import { SharedDataService } from '../shared-data.service';
import { Dough } from '../add-dough/dough.model';
import { Filling } from '../add-filling/filling.model';
import { Topping } from '../add-topping/topping.model';

import { NgFor, NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { TextFieldModule } from '@angular/cdk/text-field';

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

  constructor(private apiService: ApiService, private sharedDataService: SharedDataService, private router: Router) {}

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

  isComponentSelected(type: string, id: string): boolean {
    return this.selectedComponents.some((comp) => comp.type === type && comp.id === id);
  }

  addCake() {
    if (this.cakeName == "" || this.selectedComponents.length == 0 && (this.ingredients == "" || this.instructions =="" )){
      alert("Fülle alle benötigten Felder aus.")
      return;
    }
    this.apiService.addCake(this.cakeName, this.ingredients, this.instructions, this.selectedComponents).subscribe({next: () => {
          this.sharedDataService.refreshCakes();
          this.router.navigate(['/']);
        },
        error: (err) => console.log(err),
      });
  }

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
