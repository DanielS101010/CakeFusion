import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Dough } from './add-dough/dough.model';
import { Filling } from './add-filling/filling.model';
import { Topping } from './add-topping/topping.model';
import { Cake } from './add-cake/cake.model';


@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) {}
  
  baseUrl = 'http://localhost:3000'

  allDoughs(): Observable<Dough[]>{
    return this.http.get<Dough[]>(this.baseUrl + '/dough')
  }

  singleDough(id:string): Observable<Dough>{
    return this.http.get<Dough>(this.baseUrl + '/dough/' + id)
  } 

  addDough(doughName: string, doughIngredients: string, doughInstructions: string, doughQuantity: number):Observable<any>{
    return this.http.post(this.baseUrl + '/dough', {name: doughName, ingredients: doughIngredients, instructions:  doughInstructions, quantity: doughQuantity})
    
  }

  updateDough(id: string, doughName: string, doughIngredients: string, doughInstructions: string, doughQuantity: number){
    return this.http.patch(this.baseUrl + '/dough', {id: id, name: doughName, ingredients: doughIngredients, instructions: doughInstructions, quantity: doughQuantity})
  }

  deleteDough(id:string):Observable<any>{
    return this.http.delete(this.baseUrl + '/dough/' + id)
  }

  allFillings(): Observable<Filling[]>{
    return this.http.get<Filling[]>(this.baseUrl + '/filling')
  }

  singleFilling(id:string): Observable<Filling>{
    return this.http.get<Filling>(this.baseUrl + '/filling/' + id)
  } 

  addFilling(fillingName: string, fillingIngredients: string, fillingInstructions: string, fillingQuantity: number):Observable<any>{
    return this.http.post(this.baseUrl + '/filling', {name: fillingName, ingredients: fillingIngredients, instructions:  fillingInstructions, quantity: fillingQuantity})
  }

  updateFilling(id: string, fillingName: string, fillingIngredients: string, fillingInstructions: string, fillingQuantity: number){
    return this.http.patch(this.baseUrl + '/filling', {id: id, name: fillingName, ingredients: fillingIngredients, instructions: fillingInstructions, quantity: fillingQuantity})

  }

  deleteFilling(id:string):Observable<any>{
    return this.http.delete(this.baseUrl + '/filling/' + id)
  }

  allToppings(): Observable<Topping[]>{
    return this.http.get<Topping[]>(this.baseUrl + '/topping')
  }

  singleTopping(id:string): Observable<Topping>{
    return this.http.get<Topping>(this.baseUrl + '/topping/' + id)
  } 

  addTopping(toppingName: string, toppingIngredients: string, toppingInstructions: string, toppingQuantity: number):Observable<any>{
    return this.http.post(this.baseUrl + '/topping', {name: toppingName, ingredients: toppingIngredients, instructions:  toppingInstructions, quantity: toppingQuantity})
  }

  updateTopping(id: string, toppingName: any, toppingIngredients: any, toppingInstructions: string, toppingQuantity: number){
    return this.http.patch(this.baseUrl + '/topping', {id: id, name: toppingName, ingredients: toppingIngredients, instructions: toppingInstructions, quantity: toppingQuantity})

  }

  deleteTopping(id:string):Observable<any>{
    return this.http.delete(this.baseUrl + '/topping/' + id)
  }

  allCakes(): Observable<Cake[]>{
    return this.http.get<Cake[]>(this.baseUrl + '/cake')
  }

  singleCake(id:string): Observable<Cake>{
    return this.http.get<Cake>(this.baseUrl + '/cake/' + id)
  } 

  addCake(cakeName: string, ingredients: string, instructions: string, selectedComponents: { type: string; id: string; }[]):Observable<any>{
    console.log(cakeName, selectedComponents, ingredients, instructions)
    return this.http.post(this.baseUrl + '/cake', {name: cakeName, components: selectedComponents, ingredients: ingredients, instructions: instructions})
  }

  updateCake(id: string, cakeName: string,  ingredients: string, instructions: string, selectedComponents: { type: string; id: string; }[]){
    return this.http.patch(this.baseUrl + '/cake', {id: id, name: cakeName, components: selectedComponents, ingredients: ingredients, instructions: instructions})
  }
  deleteCake(id:string):Observable<any>{
    return this.http.delete(this.baseUrl + '/cake/' + id)
  }
}
