import { Component } from '@angular/core';
import { Dough } from '../add-dough/dough.model'
import { NgFor } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SharedDataService } from '../shared-data.service';
import { Filling } from '../add-filling/filling.model';
import { Topping } from '../add-topping/topping.model';
import { Cake } from '../add-cake/cake.model';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-mainpage',
  standalone: true,
  imports: [NgFor, RouterLink],
  templateUrl: './mainpage.component.html',
  styleUrl: './mainpage.component.css'
})
export class MainpageComponent {
  doughs: Dough[] = []
  fillings: Filling[] = []
  toppings: Topping[] = []
  cakes: Cake[] = []

  constructor(private apiService: ApiService, private sharedDataService: SharedDataService){}

  ngOnInit(): void {
    this.sharedDataService.doughs$.subscribe(doughs => {
      this.doughs = doughs;
    });

    this.sharedDataService.fillings$.subscribe(fillings => {
      this.fillings = fillings;
    });

    this.sharedDataService.toppings$.subscribe(toppings => {
      this.toppings = toppings;
    });

    this.sharedDataService.cakes$.subscribe((cakes) => {
      this.cakes = cakes;
    });
  }

  deleteDough(id: string){
    this.apiService.deleteDough(id).subscribe({
      next: () => {
        this.sharedDataService.refreshDoughs()
      },
      error: (err) => console.error(err)
    })
  }

  deleteFilling(id: string){
    this.apiService.deleteFilling(id).subscribe({
      next: () => {
        this.sharedDataService.refreshFillings()
      },
      error: (err) => console.error(err)
    })
  }

  deleteTopping(id: string){
    this.apiService.deleteTopping(id).subscribe({
      next: () => {
        this.sharedDataService.refreshToppings()
      },
      error: (err) => console.error(err)
    })
  }

  deleteCake(id: string){
    this.apiService.deleteCake(id).subscribe({
      next: () => {
        this.sharedDataService.refreshCakes()
      },
      error: (err) => console.error(err)
    })
  }
}
