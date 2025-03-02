import { Component } from '@angular/core';
import { ApiService } from '../api.service';
import { FormsModule } from '@angular/forms';
import { SharedDataService } from '../shared-data.service';
import { Router } from '@angular/router';
import { TextFieldModule } from '@angular/cdk/text-field';

@Component({
  selector: 'app-add-topping',
  standalone: true,
  imports: [FormsModule, TextFieldModule],
  templateUrl: './add-topping.component.html',
  styleUrl: './add-topping.component.css'
})
export class AddToppingComponent {
  toppingName = "";
  toppingIngredients = "";
  toppingInstructions = "";
  toppingQuantity = 1;
  constructor(private apiServie: ApiService, private sharedDataService: SharedDataService, private router: Router){}
  
  addTopping(){
    if (this.toppingName == "" || this.toppingIngredients == "" || this.toppingInstructions == ""){
      alert("Fülle alle benötigten Felder aus.")
      return;
    }

    this.apiServie.addTopping(this.toppingName, this.toppingIngredients, this.toppingInstructions, this.toppingQuantity).subscribe({next:() => {
      this.sharedDataService.refreshToppings()
      this.router.navigate(['/']);
    },
      error: (err) => console.log(err)
      });
  }
}
