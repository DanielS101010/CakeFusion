export interface Cake {
    _id: string;
    name: string;
    components: Array<{
      type: 'dough' | 'filling' | 'topping';
      id: string;
      quantity: number;
    }>;
    ingredients: string;
    instructions: string;
  }