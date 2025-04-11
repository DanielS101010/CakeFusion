import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ApiService } from './api.service';
import { Dough } from '../add-dough/dough.model';
import { Filling } from '../add-filling/filling.model';
import { Topping } from '../add-topping/topping.model';
import { Cake } from '../add-cake/cake.model';
import { Tags } from './tags.model';

@Injectable({
  providedIn: 'root',
})
export class SharedDataService {
  private doughsSubject = new BehaviorSubject<Dough[]>([]);
  public doughs$ = this.doughsSubject.asObservable();

  private fillingsSubject = new BehaviorSubject<Filling[]>([]);
  public fillings$ = this.fillingsSubject.asObservable();

  private toppingsSubject = new BehaviorSubject<Topping[]>([]);
  public toppings$ = this.toppingsSubject.asObservable();

  private cakesSubject = new BehaviorSubject<Cake[]>([]);
  public cakes$ = this.cakesSubject.asObservable();

  private tagsSubject = new BehaviorSubject<Tags[]>([]);
  public tags$ = this.tagsSubject.asObservable();

  constructor(private apiService: ApiService) {
    this.loadDoughs();
    this.loadFillings();
    this.loadToppings();
    this.loadCakes();
    this.loadTags();
  }

  private loadDoughs(): void {
    this.apiService.allDoughs().subscribe(doughs => {
      this.doughsSubject.next(doughs);
    });
  }

  public refreshDoughs(): void {
    this.loadDoughs();
  }

  private loadFillings(): void {
    this.apiService.allFillings().subscribe(fillings => {
      this.fillingsSubject.next(fillings);
    });
  }

  public refreshFillings(): void {
    this.loadFillings();
  }

  private loadToppings(): void {
    this.apiService.allToppings().subscribe(toppings => {
      this.toppingsSubject.next(toppings);
    });
  }

  public refreshToppings(): void {
    this.loadToppings();
  }

  private loadCakes(): void {
    this.apiService.allCakes().subscribe(cakes => {
      this.cakesSubject.next(cakes);
    });
  }

  public refreshCakes(): void {
    this.loadCakes();
  }

  private loadTags(): void {
    this.apiService.allTags().subscribe(tags => {
      this.tagsSubject.next(tags);
    });
  }

  public refreshTags(): void {
    this.loadTags();
  }
}
