import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Dough } from '../add-dough/dough.model';
import { Filling } from '../add-filling/filling.model';
import { Topping } from '../add-topping/topping.model';
import { Cake } from '../add-cake/cake.model';
import { Tags } from './tags.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) {}

  baseUrl = '/api';

  allDoughs(): Observable<Dough[]> {
    return this.http.get<{ data: Dough[] }>(this.baseUrl + '/dough')
      .pipe(map(response => response.data));
  }

  singleDough(id: string): Observable<Dough> {
    return this.http.get<{ data: Dough }>(this.baseUrl + '/dough/' + id)
      .pipe(map(response => response.data));
  }

  addDough(doughName: string, doughIngredients: string, doughInstructions: string, doughQuantity: number, doughTags: string[], image: string): Observable<any> {
    return this.http.post<{ data: any }>(this.baseUrl + '/dough', {
      name: doughName,
      ingredients: doughIngredients,
      instructions: doughInstructions,
      quantity: doughQuantity,
      tags: doughTags,
      image: image,
    }).pipe(map(response => response.data));
  }

  updateDough(id: string, doughName: string, doughIngredients: string, doughInstructions: string, doughQuantity: number, doughTags: string[], image: string) {
    return this.http.patch<{ data: any }>(this.baseUrl + '/dough', {
      id: id,
      name: doughName,
      ingredients: doughIngredients,
      instructions: doughInstructions,
      quantity: doughQuantity,
      tags: doughTags,
      image: image,
    }).pipe(map(response => response.data));
  }

  deleteDough(id: string): Observable<any> {
    return this.http.delete<{ data: any }>(this.baseUrl + '/dough/' + id)
      .pipe(map(response => response.data));
  }

  allFillings(): Observable<Filling[]> {
    return this.http.get<{ data: Filling[] }>(this.baseUrl + '/filling')
      .pipe(map(response => response.data));
  }

  singleFilling(id: string): Observable<Filling> {
    return this.http.get<{ data: Filling }>(this.baseUrl + '/filling/' + id)
      .pipe(map(response => response.data));
  }

  addFilling(fillingName: string, fillingIngredients: string, fillingInstructions: string, fillingQuantity: number, tagIds: string[]): Observable<any> {
    return this.http.post<{ data: any }>(this.baseUrl + '/filling', {
      name: fillingName,
      ingredients: fillingIngredients,
      instructions: fillingInstructions,
      quantity: fillingQuantity,
      tags: tagIds,
    }).pipe(map(response => response.data));
  }

  updateFilling(id: string, fillingName: string, fillingIngredients: string, fillingInstructions: string, fillingQuantity: number, tagIds: string[], image: string) {
    return this.http.patch<{ data: any }>(this.baseUrl + '/filling', {
      id: id,
      name: fillingName,
      ingredients: fillingIngredients,
      instructions: fillingInstructions,
      quantity: fillingQuantity,
      tags: tagIds,
      image: image,
    }).pipe(map(response => response.data));
  }

  deleteFilling(id: string): Observable<any> {
    return this.http.delete<{ data: any }>(this.baseUrl + '/filling/' + id)
      .pipe(map(response => response.data));
  }

  allToppings(): Observable<Topping[]> {
    return this.http.get<{ data: Topping[] }>(this.baseUrl + '/topping')
      .pipe(map(response => response.data));
  }

  singleTopping(id: string): Observable<Topping> {
    return this.http.get<{ data: Topping }>(this.baseUrl + '/topping/' + id)
      .pipe(map(response => response.data));
  }

  addTopping(toppingName: string, toppingIngredients: string, toppingInstructions: string, toppingQuantity: number, tagIds: string[]): Observable<any> {
    return this.http.post<{ data: any }>(this.baseUrl + '/topping', {
      name: toppingName,
      ingredients: toppingIngredients,
      instructions: toppingInstructions,
      quantity: toppingQuantity,
      tags: tagIds,
    }).pipe(map(response => response.data));
  }

  updateTopping(id: string, toppingName: any, toppingIngredients: any, toppingInstructions: string, toppingQuantity: number, tagIds: string[], image: string) {
    return this.http.patch<{ data: any }>(this.baseUrl + '/topping', {
      id: id,
      name: toppingName,
      ingredients: toppingIngredients,
      instructions: toppingInstructions,
      quantity: toppingQuantity,
      tags: tagIds,
      image: image,
    }).pipe(map(response => response.data));
  }

  deleteTopping(id: string): Observable<any> {
    return this.http.delete<{ data: any }>(this.baseUrl + '/topping/' + id)
      .pipe(map(response => response.data));
  }

  allCakes(): Observable<Cake[]> {
    return this.http.get<{ data: Cake[] }>(this.baseUrl + '/cake')
      .pipe(map(response => response.data));
  }

  singleCake(id: string): Observable<Cake> {
    return this.http.get<{ data: Cake }>(this.baseUrl + '/cake/' + id)
      .pipe(map(response => response.data));
  }

  addCake(cakeName: string, ingredients: string, instructions: string, selectedComponents: { type: string; id: string; }[], tagIds: string[]): Observable<any> {
    return this.http.post<{ data: any }>(this.baseUrl + '/cake', {
      name: cakeName,
      components: selectedComponents,
      ingredients: ingredients,
      instructions: instructions,
      tags: tagIds,
    }).pipe(map(response => response.data));
  }

  updateCake(id: string, cakeName: string, ingredients: string, instructions: string, selectedComponents: { type: string; id: string; }[], tagIds: string[], image: string) {
    return this.http.patch<{ data: any }>(this.baseUrl + '/cake', {
      id: id,
      name: cakeName,
      components: selectedComponents,
      ingredients: ingredients,
      instructions: instructions,
      tags: tagIds,
      image: image,
    }).pipe(map(response => response.data));
  }

  deleteCake(id: string): Observable<any> {
    return this.http.delete<{ data: any }>(this.baseUrl + '/cake/' + id)
      .pipe(map(response => response.data));
  }

  allTags(): Observable<Tags[]> {
    return this.http.get<{ data: Tags[] }>(this.baseUrl + '/tags')
      .pipe(map(response => response.data));
  }

  singleTag(id: string): Observable<Tags> {
    return this.http.get<{ data: Tags }>(this.baseUrl + '/tags/' + id)
      .pipe(map(response => response.data));
  }

  addTag(tagName: string): Observable<any> {
    return this.http.post<{ data: any }>(this.baseUrl + '/tags', {
      name: tagName,
    }).pipe(map(response => response.data));
  }

  updateTag(id: string, tagName: string) {
    return this.http.patch<{ data: any }>(this.baseUrl + '/tags', {
      id: id,
      name: tagName,
    }).pipe(map(response => response.data));
  }

  deleteTag(id: string): Observable<any> {
    return this.http.delete<{ data: any }>(this.baseUrl + '/tags/' + id)
      .pipe(map(response => response.data));
  }
}
