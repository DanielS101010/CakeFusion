import { Component } from '@angular/core';
import { ApiService } from '../api.service';
import { FormsModule } from '@angular/forms';
import { SharedDataService } from '../shared-data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-topping',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './add-topping.component.html',
  styleUrl: './add-topping.component.css'
})
export class AddToppingComponent {
  toppingName = "";
  toppingIngredients = "";
  toppingInstructions = "";
  toppingQuantity! : number;
  constructor(private apiServie: ApiService, private sharedDataService: SharedDataService, private router: Router){}
  
  addTopping(){
    this.apiServie.addTopping(this.toppingName, this.toppingIngredients, this.toppingInstructions, this.toppingQuantity).subscribe({next:() => {
      this.sharedDataService.refreshToppings()
      this.router.navigate(['/']);
    },
      error: (err) => console.log(err)
      });
  }
}
