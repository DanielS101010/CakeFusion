import { Component } from '@angular/core';
import { ApiService } from '../api.service';
import { FormsModule } from '@angular/forms';
import { SharedDataService } from '../shared-data.service';
import { Router } from '@angular/router'; 
import { TextFieldModule } from '@angular/cdk/text-field';
@Component({
  selector: 'app-add-dough',
  standalone: true,
  imports: [FormsModule, TextFieldModule],
  templateUrl: './add-dough.component.html',
  styleUrl: './add-dough.component.css',
})

export class AddDoughComponent {
  doughName = "";
  doughIngredients = "";
  doughInstructions = "";
  doughQuantity = 1 ;

  constructor(private apiService: ApiService, private sharedDataService: SharedDataService, private router: Router){}
  
  addDough(){
    if (this.doughName == "" || this.doughIngredients == "" || this.doughInstructions == ""){
      alert("Fülle alle benötigten Felder aus.")
      return;
    }
    this.apiService.addDough(this.doughName, this.doughIngredients, this.doughInstructions, this.doughQuantity).subscribe({next:() => {
    this.sharedDataService.refreshDoughs();
    this.router.navigate(['/']);
    },
    error: (err) => console.log(err)
    });
  }
}
