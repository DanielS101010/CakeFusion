import { TestBed } from '@angular/core/testing';
import {  HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ApiService } from './api.service';
import { Dough } from '../add-dough/dough.model';
import { Filling } from '../add-filling/filling.model';
import { Topping } from '../add-topping/topping.model';
import { Cake } from '../add-cake/cake.model';
import { provideHttpClient } from '@angular/common/http';
import { Tags } from './tags.model';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;
  const baseUrl = '/api';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [ApiService, provideHttpClient(), provideHttpClientTesting(),
      ]
    });
    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  // Dough methods tests
  describe('Dough methods', () => {
    it('should fetch all doughs', () => {
      const dummyDoughs: Dough[] = [
        {
          _id: '1', name: 'Dough 1', ingredients: [{ quantity: 100, description: 'g flour' }],
          instructions: 'mix', quantity: 10, tags: [],
          image: ''
        },
        {
          _id: '2', name: 'Dough 2', ingredients: [{ quantity: 20, description: 'ml water' }],
          instructions: 'bake', quantity: 5, tags: [],
          image: ''
        }
      ];
      service.allDoughs().subscribe(doughs => {
        expect(doughs).toEqual(dummyDoughs);
      });
      const req = httpMock.expectOne(`${baseUrl}/dough`);
      expect(req.request.method).toBe('GET');
      req.flush({data: dummyDoughs});
    });

    it('should fetch a single dough', () => {
      const dummyDough: Dough = {
        _id: '1', name: 'Dough 1', ingredients: [{ quantity: 100, description: 'g flour' }],
        instructions: 'mix', quantity: 10, tags: [],
        image: ''
      };
      service.singleDough('1').subscribe(dough => {
        expect(dough).toEqual(dummyDough);
      });
      const req = httpMock.expectOne(`${baseUrl}/dough/1`);
      expect(req.request.method).toBe('GET');
      req.flush({data: dummyDough});
    });

    it('should add a dough', () => {
      const doughName = 'New Dough';
      const doughIngredients = '100g flour, 20ml water';
      const doughInstructions = 'mix well';
      const doughQuantity = 5;
      const doughTags: string[] = [];
      const image = ""

      const response = { success: true };

      service.addDough(doughName, doughIngredients, doughInstructions, doughQuantity, doughTags, image).subscribe(res => {
        expect(res).toEqual(response);
      });

      const req = httpMock.expectOne(`${baseUrl}/dough`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({
        name: doughName,
        ingredients: doughIngredients,
        instructions: doughInstructions,
        quantity: doughQuantity,
        tags: doughTags,
        image: image
      });
      req.flush({data: response});
    });

    it('should update a dough', () => {
      const id = '1';
      const doughName = 'Updated Dough';
      const doughIngredients = 'flour, water, sugar';
      const doughInstructions = 'mix thoroughly';
      const doughQuantity = 7;
      const doughTags: any[] = [];
      const response = { success: true };
      const image = 'base64data';

      service.updateDough(id, doughName, doughIngredients, doughInstructions, doughQuantity, doughTags, image).subscribe(res => {
        expect(res).toEqual(response);
      });

      const req = httpMock.expectOne(`${baseUrl}/dough`);
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body).toEqual({
        id: id,
        name: doughName,
        ingredients: doughIngredients,
        instructions: doughInstructions,
        quantity: doughQuantity,
        tags: doughTags,
        image: image,
      });
      req.flush({data: response});
    });

    it('should delete a dough', () => {
      const id = '1';
      const response = { success: true };

      service.deleteDough(id).subscribe(res => {
        expect(res).toEqual(response);
      });

      const req = httpMock.expectOne(`${baseUrl}/dough/1`);
      expect(req.request.method).toBe('DELETE');
      req.flush({data: response});
    });
  });

  // Filling methods tests
  describe('Filling methods', () => {
    it('should fetch all fillings', () => {
      const dummyFillings: Filling[] = [
        {
          _id: '1', name: 'Filling 1', ingredients: [{ quantity: 1, description: 'sugar' }],
          instructions: 'blend', quantity: 10, tags: [],
          image: ''
        },
        {
          _id: '2', name: 'Filling 2', ingredients: [{ quantity: 2, description: 'cocoa' }],
          instructions: 'mix', quantity: 5, tags: [],
          image: ''
        }
      ];
      service.allFillings().subscribe(fillings => {
        expect(fillings).toEqual(dummyFillings);
      });
      const req = httpMock.expectOne(`${baseUrl}/filling`);
      expect(req.request.method).toBe('GET');
      req.flush({data: dummyFillings});
    });

    it('should fetch a single filling', () => {
      const dummyFilling: Filling = {
        _id: '1', name: 'Filling 1', ingredients: [{ quantity: 1, description: 'sugar' }],
        instructions: 'blend', quantity: 10, tags: [],
        image: ''
      };
      service.singleFilling('1').subscribe(filling => {
        expect(filling).toEqual(dummyFilling);
      });
      const req = httpMock.expectOne(`${baseUrl}/filling/1`);
      expect(req.request.method).toBe('GET');
      req.flush({data: dummyFilling});
    });

    it('should add a filling', () => {
      const fillingName = 'New Filling';
      const fillingIngredients = 'sugar, cocoa';
      const fillingInstructions = 'blend well';
      const fillingQuantity = 3;
      const fillingTags: string[] = [];
      const response = { success: true };

      service.addFilling(fillingName, fillingIngredients, fillingInstructions, fillingQuantity, fillingTags).subscribe(res => {
        expect(res).toEqual(response);
      });

      const req = httpMock.expectOne(`${baseUrl}/filling`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({
        name: fillingName,
        ingredients: fillingIngredients,
        instructions: fillingInstructions,
        quantity: fillingQuantity,
        tags: fillingTags,
      });
      req.flush({data: response});
    });

    it('should update a filling', () => {
      const id = '1';
      const fillingName = 'Updated Filling';
      const fillingIngredients = 'sugar, cocoa, milk';
      const fillingInstructions = 'blend thoroughly';
      const fillingQuantity = 4;
      const fillingTags: string[] = [];
      const response = { success: true };
      const image = 'base64data';

      service.updateFilling(id, fillingName, fillingIngredients, fillingInstructions, fillingQuantity, fillingTags, image).subscribe(res => {
        expect(res).toEqual(response);
      });

      const req = httpMock.expectOne(`${baseUrl}/filling`);
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body).toEqual({
        id: id,
        name: fillingName,
        ingredients: fillingIngredients,
        instructions: fillingInstructions,
        quantity: fillingQuantity,
        tags: fillingTags,
        image: image,
      });
      req.flush({data: response});
    });

    it('should delete a filling', () => {
      const id = '1';
      const response = { success: true };

      service.deleteFilling(id).subscribe(res => {
        expect(res).toEqual(response);
      });

      const req = httpMock.expectOne(`${baseUrl}/filling/1`);
      expect(req.request.method).toBe('DELETE');
      req.flush({data: response});
    });
  });

  // Topping methods tests
  describe('Topping methods', () => {
    it('should fetch all toppings', () => {
      const dummyToppings: Topping[] = [
        {
          _id: '1', name: 'Topping 1', ingredients: [{ quantity: 1, description: 'nuts' }],
          instructions: 'sprinkle', quantity: 8, tags: []
        },
        {
          _id: '2', name: 'Topping 2', ingredients: [{ quantity: 2, description: 'chocolate' }],
          instructions: 'garnish', quantity: 6, tags: []
        }
      ];
      service.allToppings().subscribe(toppings => {
        expect(toppings).toEqual(dummyToppings);
      });
      const req = httpMock.expectOne(`${baseUrl}/topping`);
      expect(req.request.method).toBe('GET');
      req.flush({data: dummyToppings});
    });

    it('should fetch a single topping', () => {
      const dummyTopping: Topping = { _id: '1', name: 'Topping 1', ingredients: [{ quantity: 1, description: 'nuts' }], instructions: 'sprinkle', quantity: 8, tags: [] };
      service.singleTopping('1').subscribe(topping => {
        expect(topping).toEqual(dummyTopping);
      });
      const req = httpMock.expectOne(`${baseUrl}/topping/1`);
      expect(req.request.method).toBe('GET');
      req.flush({data: dummyTopping});
    });

    it('should add a topping', () => {
      const toppingName = 'New Topping';
      const toppingIngredients = 'nuts, caramel';
      const toppingInstructions = 'sprinkle lightly';
      const toppingQuantity = 3;
      const toppingTags: string[] = [];
      const response = { success: true };

      service.addTopping(toppingName, toppingIngredients, toppingInstructions, toppingQuantity, toppingTags).subscribe(res => {
        expect(res).toEqual(response);
      });

      const req = httpMock.expectOne(`${baseUrl}/topping`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({
        name: toppingName,
        ingredients: toppingIngredients,
        instructions: toppingInstructions,
        quantity: toppingQuantity,
        tags: toppingTags,
      });
      req.flush({data: response});
    });

    it('should update a topping', () => {
      const id = '1';
      const toppingName = 'Updated Topping';
      const toppingIngredients = 'nuts, caramel, vanilla';
      const toppingInstructions = 'sprinkle lightly';
      const toppingQuantity = 4;
      const toppingTags: string[] = [];
      const response = { success: true };
      const image = 'base64data';

      service.updateTopping(id, toppingName, toppingIngredients, toppingInstructions, toppingQuantity, toppingTags, image).subscribe(res => {
        expect(res).toEqual(response);
      });

      const req = httpMock.expectOne(`${baseUrl}/topping`);
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body).toEqual({
        id: id,
        name: toppingName,
        ingredients: toppingIngredients,
        instructions: toppingInstructions,
        quantity: toppingQuantity,
        tags: toppingTags,
        image: image,
      });
      req.flush({data: response});
    });

    it('should delete a topping', () => {
      const id = '1';
      const response = { success: true };

      service.deleteTopping(id).subscribe(res => {
        expect(res).toEqual(response);
      });

      const req = httpMock.expectOne(`${baseUrl}/topping/1`);
      expect(req.request.method).toBe('DELETE');
      req.flush({data: response});
    });
  });

  // cake Methods testing
  describe('Cake methods', () => {
    it('should fetch all cakes', () =>{
      const dummyCakes: Cake[] = [
        {
          _id: '1',
          name: 'Cake 1',
          ingredients: [{ quantity: 1, description: 'flour' }],
          instructions: 'bake',
          components: [],
          tags: []
        },
        {
          _id: '2',
          name: 'Cake 2',
          ingredients: [{ quantity: 10, description: 'flour' }],
          instructions: 'bake',
          components: [],
          tags: []
        }
      ];

      service.allCakes().subscribe(cakes =>{
        expect(cakes).toEqual(dummyCakes);
      });

      const req = httpMock.expectOne(`${baseUrl}/cake`);
      expect(req.request.method).toBe('GET');
      req.flush({data: dummyCakes});
    });

    it('should fetch a single cake', () => {
      const dummyCake: Cake = {
        _id: '1',
        name: 'Cake 1',
        ingredients: [{ quantity: 1, description: 'flour' }],
        instructions: 'bake',
        components: [],
        tags: []
      };
      service.singleCake('1').subscribe(cake => {
        expect(cake).toEqual(dummyCake);
      });
      const req = httpMock.expectOne(`${baseUrl}/cake/1`);
      expect(req.request.method).toBe('GET');
      req.flush({data: dummyCake});
    });

    it('should add a cake', () => {
      const cakeName = 'New Cake';
      const ingredients = '1 flour\n2 sugar\n3 eggs';
      const instructions = 'mix and bake';
      const selectedComponents: [] = [];
      const tags: string[] = [];
      const image = 'base64data';

      const expectedParsedIngredients = [
        { quantity: 1, description: 'flour' },
        { quantity: 2, description: 'sugar' },
        { quantity: 3, description: 'eggs' }
      ];

      const response: Cake = {
        _id: '1',
        name: cakeName,
        ingredients: expectedParsedIngredients,
        instructions: instructions,
        components: selectedComponents,
        tags: tags,
      };

      service.addCake(cakeName, ingredients, instructions, selectedComponents, tags).subscribe(res => {
        expect(res).toEqual(response);
      });

      const req = httpMock.expectOne(`${baseUrl}/cake`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({
        name: cakeName,
        ingredients,
        instructions,
        components: selectedComponents,
        tags: tags
      });
      req.flush({data: response});
    });

    it('should update a cake', () => {
      const id = '1';
      const cakeName = 'Updated Cake';
      const ingredients = '2 flour\n3 eggs';
      const instructions = 'mix, bake, cool';
      const selectedComponents: [] = [];
      const tags: string[] = [];
      const image = "";

      const expectedParsedIngredients = [
        { quantity: 2, description: 'flour' },
        { quantity: 3, description: 'eggs' }
      ];

      const response: Cake = {
        _id: id,
        name: cakeName,
        ingredients: expectedParsedIngredients,
        instructions: instructions,
        components: selectedComponents,
        tags: []
      };

      service.updateCake(id, cakeName, ingredients, instructions, selectedComponents, tags, image).subscribe(res => {
        expect(res).toEqual(response);
      });

      const req = httpMock.expectOne(`${baseUrl}/cake`);
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body).toEqual({
        id: id,
        name: cakeName,
        ingredients,
        instructions,
        components: selectedComponents,
        tags: tags,
        image: "",
      });
      req.flush({data: response});
    });

    it('should delete a cake', () => {
      const id = '1';
      const response = { success: true };

      service.deleteCake(id).subscribe(res => {
        expect(res).toEqual(response);
      });

      const req = httpMock.expectOne(`${baseUrl}/cake/1`);
      expect(req.request.method).toBe('DELETE');
      req.flush({data: response});
    });
  });

  describe('Tags Method', () =>{
    it('should fetch all tags', () =>{
      const dummyTags: Tags[] = [
        {_id:"1", name: "chocolat"},
        {_id:"2", name: "nut"},
      ];

      service.allTags().subscribe(tags => {
        expect(tags).toEqual(dummyTags);
      });
      const req = httpMock.expectOne(`${baseUrl}/tags`);
      expect(req.request.method).toBe('GET');
      req.flush({data: dummyTags});
      
    });
    it('should feth one tag', () =>{
      const dummyTag: Tags = { _id: '1', name: 'nut' };
      service.singleTag('1').subscribe(tag => {
        expect(tag).toEqual(dummyTag);
      });
      const req = httpMock.expectOne(`${baseUrl}/tags/1`);
      expect(req.request.method).toBe('GET');
      req.flush({ data: dummyTag });
    })
  
    it('should Update a tag', () =>{
      const id = '1';
      const tagName = 'Updated Tag';
      const response = { success: true };

      service.updateTag(id, tagName).subscribe(res => {
        expect(res).toEqual(response);
      });
      const req = httpMock.expectOne(`${baseUrl}/tags`);
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body).toEqual({ id: id, name: tagName });
      req.flush({ data: response });
    });

    it('should delete a tag', () => {
      const id = '1';
      const response = { success: true };

      service.deleteTag(id).subscribe(res => {
        expect(res).toEqual(response);
      });
      const req = httpMock.expectOne(`${baseUrl}/tags/1`);
      expect(req.request.method).toBe('DELETE');
      req.flush({ data: response });
    });
  });
});
