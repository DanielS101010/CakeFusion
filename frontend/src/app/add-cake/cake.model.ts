export interface Ingredient {
  quantity: number;
  description: string;
}

export interface Cake {
    _id: string;
    name: string;
    components: Array<{
      type: 'dough' | 'filling' | 'topping';
      id: string;
      quantity: number;
    }>;
    ingredients: Ingredient[];
    instructions: string;
    tags: string[];
    image?: string;
  }
