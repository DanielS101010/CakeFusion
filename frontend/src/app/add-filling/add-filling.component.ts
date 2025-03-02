import { Component } from '@angular/core';
import { ApiService } from '../api.service';
import { FormsModule } from '@angular/forms';
import { SharedDataService } from '../shared-data.service';
import { Router } from '@angular/router';
import { TextFieldModule } from '@angular/cdk/text-field';

@Component({
  selector: 'app-add-filling',
  standalone: true,
  imports: [FormsModule, TextFieldModule],
  templateUrl: './add-filling.component.html',
  styleUrl: './add-filling.component.css'
})

export class AddFillingComponent {
  fillingName = "";
  fillingIngredients = "";
  fillingInstructions = "";
  fillingQuantity = 1;

  constructor(private apiServie: ApiService, private sharedDataService: SharedDataService, private router: Router){}
  
  addFilling(){
    if (this.fillingName == "" || this.fillingIngredients == "" || this.fillingInstructions == ""){
      alert("Fülle alle benötigten Felder aus.")
      return;
    }
    this.apiServie.addFilling(this.fillingName, this.fillingIngredients, this.fillingInstructions, this.fillingQuantity).subscribe({next:() => {
      this.sharedDataService.refreshFillings();
      this.router.navigate(['/']);

      },
      error: (err) => console.log(err)
      });
  }
}
