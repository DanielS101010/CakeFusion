import { Component, Input } from '@angular/core';
import { Dough } from '../add-dough/dough.model'
import { NgFor } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SharedDataService } from '../service/shared-data.service';
import { Filling } from '../add-filling/filling.model';
import { Topping } from '../add-topping/topping.model';
import { Cake } from '../add-cake/cake.model';
import { ApiService } from '../service/api.service';
import { FilterComponent } from '../filter/filter.component';

@Component({
  selector: 'app-mainpage',
  standalone: true,
  imports: [NgFor, RouterLink, FilterComponent],
  templateUrl: './mainpage.component.html',
  styleUrl: './mainpage.component.css'
})
export class MainpageComponent {
  @Input() selectedTags: string[] = [];

  doughs: Dough[] = []
  fillings: Filling[] = []
  toppings: Topping[] = []
  cakes: Cake[] = []

  filteredDoughs: Dough[] = []
  filteredFillings: Filling[] = []
  filteredToppings: Topping[] = []
  filteredCakes: Cake[] = []

  constructor(private apiService: ApiService, private sharedDataService: SharedDataService){}

  ngOnInit(): void {
    this.sharedDataService.doughs$.subscribe(doughs => {
      this.doughs = doughs;
      this.applyFilters()
    });

    this.sharedDataService.fillings$.subscribe(fillings => {
      this.fillings = fillings;
      this.applyFilters()
    });

    this.sharedDataService.toppings$.subscribe(toppings => {
      this.toppings = toppings;
      this.applyFilters()

    });

    this.sharedDataService.cakes$.subscribe((cakes) => {
      this.cakes = cakes;
      this.applyFilters()
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

  onFilterChanged(tags: string[]) {
    this.selectedTags = tags;
    if(this.selectedTags.length > 0){
      this.applyFilters();
    }else{
      this.filteredDoughs = this.doughs;
      this.filteredFillings = this.fillings;
      this.filteredToppings = this.toppings;
      this.filteredCakes = this.cakes;
    }
  }

  applyFilters() {
    this.filteredDoughs = this.doughs.filter(dough => this.selectedTags.every(tag => dough.tags.includes(tag)));
    this.filteredFillings = this.fillings.filter(filling => this.selectedTags.every(tag => filling.tags.includes(tag)));
    this.filteredToppings = this.toppings.filter(topping => this.selectedTags.every(tag => topping.tags.includes(tag)));
    this.filteredCakes = this.cakes.filter(cake => this.selectedTags.every(tag => cake.tags.includes(tag)));

  }  
}
