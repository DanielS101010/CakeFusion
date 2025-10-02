import { Injectable, computed, signal } from '@angular/core';
import { Cake } from '../add-cake/cake.model';
import { Dough } from '../add-dough/dough.model';
import { Filling } from '../add-filling/filling.model';
import { Topping } from '../add-topping/topping.model';
import { SharedDataService } from './shared-data.service';

@Injectable({
  providedIn: 'root'
})
export class FilterService {
  private readonly selectedTags = signal<string[]>([]);
  private readonly searchTerm = signal<string>('');

  private readonly doughs = signal<Dough[]>([]);
  private readonly fillings = signal<Filling[]>([]);
  private readonly toppings = signal<Topping[]>([]);
  private readonly cakes = signal<Cake[]>([]);

  readonly filteredDoughs = computed(() => this.applyAllFilters(this.doughs()));
  readonly filteredFillings = computed(() => this.applyAllFilters(this.fillings()));
  readonly filteredToppings = computed(() => this.applyAllFilters(this.toppings()));
  readonly filteredCakes = computed(() => this.applyAllFilters(this.cakes()));

  constructor(private sharedDataService: SharedDataService) {
    this.sharedDataService.doughs$.subscribe(doughs => {
      this.doughs.set(doughs);
    });

    this.sharedDataService.fillings$.subscribe(fillings => {
      this.fillings.set(fillings);
    });

    this.sharedDataService.toppings$.subscribe(toppings => {
      this.toppings.set(toppings);
    });

    this.sharedDataService.cakes$.subscribe(cakes => {
      this.cakes.set(cakes);
    });
  }

  setSelectedTags(tags: string[]) {
    this.selectedTags.set(tags);
  }

  setSearchTerm(term: string) {
    this.searchTerm.set(term.trim().toLowerCase());
  }

  private applyAllFilters<T extends { name: string; tags: string[] }>(items: T[]): T[] {
    const selectedTags = this.selectedTags();
    const searchTerm = this.searchTerm();

    return items.filter(item => {
      const matchesTags = selectedTags.length === 0 || selectedTags.every(tag => item.tags.includes(tag));
      const matchesSearch = searchTerm === '' || item.name.toLowerCase().includes(searchTerm);
      return matchesTags && matchesSearch;
    });
  }
}
