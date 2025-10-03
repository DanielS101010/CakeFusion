import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FilterService } from '../service/filter.service';

@Component({
  selector: 'app-navBar',
  imports: [RouterLink],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent {
  constructor(private filterService: FilterService){}
  searchString = "";
  
  onSearchClick(){
    this.filterService.setSearchTerm(this.searchString);
  }

  onSearchChange(event: Event){
    const value = (event.target as HTMLInputElement | null)?.value ?? '';
    this.searchString = value;
  }
}
