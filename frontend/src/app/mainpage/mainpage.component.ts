import { Component, inject } from '@angular/core';
import { NgFor } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../service/api.service';
import { FilterComponent } from '../filter/filter.component';
import { FilterService } from '../service/filter.service';
import { SharedDataService } from '../service/shared-data.service';

@Component({
    selector: 'app-mainpage',
    imports: [NgFor, RouterLink, FilterComponent],
    templateUrl: './mainpage.component.html',
    styleUrl: './mainpage.component.css'
})
export class MainpageComponent {
  private readonly filterService = inject(FilterService);

  readonly filteredDoughs = this.filterService.filteredDoughs;
  readonly filteredFillings = this.filterService.filteredFillings;
  readonly filteredToppings = this.filterService.filteredToppings;
  readonly filteredCakes = this.filterService.filteredCakes;

  constructor(
    private apiService: ApiService,
    private sharedDataService: SharedDataService,
  ){}

  /**
   * delete a dough from the database
   * @param id id of the dough to delete
   */
  deleteDough(id: string){
    this.apiService.deleteDough(id).subscribe({
      next: () => {
        this.sharedDataService.refreshDoughs()
      },
      error: (err) => console.error(err)
    })
  }

  /**
   * delete a filling from the database
   * @param id id of the filling to delete
   */
  deleteFilling(id: string){
    this.apiService.deleteFilling(id).subscribe({
      next: () => {
        this.sharedDataService.refreshFillings()
      },
      error: (err) => console.error(err)
    })
  }

  /**
   * delete a topping from the database
   * @param id id of the topping to delete
   */
  deleteTopping(id: string){
    this.apiService.deleteTopping(id).subscribe({
      next: () => {
        this.sharedDataService.refreshToppings()
      },
      error: (err) => console.error(err)
    })
  }

  /**
   * delete a cake from the database
   * @param id id of the cake to delete
   */
  deleteCake(id: string){
    this.apiService.deleteCake(id).subscribe({
      next: () => {
        this.sharedDataService.refreshCakes()
      },
      error: (err) => console.error(err)
    })
  }

  /**
   * if filters are changed, apply it to the components
   * @param tags tags which are selected
  */
  onFilterChanged(tags: string[]) {
    this.filterService.setSelectedTags(tags);
  }
}
