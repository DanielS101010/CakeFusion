import { Component } from '@angular/core';
import { ApiService } from '../api.service';
import { FormsModule } from '@angular/forms';
import { SharedDataService } from '../shared-data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-filling',
  standalone: true,
  imports: [FormsModule],
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
    this.apiServie.addFilling(this.fillingName, this.fillingIngredients, this.fillingInstructions, this.fillingQuantity).subscribe({next:() => {
      this.sharedDataService.refreshFillings();
      this.router.navigate(['/']);

      },
      error: (err) => console.log(err)
      });
  }
}
