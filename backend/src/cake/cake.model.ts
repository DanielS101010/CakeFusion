import * as mongoose from 'mongoose';

export const CakeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  components: [
    {
      type: {
        type: String,
        enum: ['dough', 'filling', 'topping'],
      },
      id: String,
      quantity: Number,
    },
  ],
  ingredients: [{
    quantity: { type: Number, required: true },
    description: { type: String, required: true }
  }],  
  instructions: { type: String, required: false },
  tags: { type: Array<string>, required: false}
});

export interface Cake {
  id: string;
  name: string;
  components: Array<{
    type: 'dough' | 'filling' | 'topping';
    id: string;
    quantity: number;
  }>;
  ingredients: Array<{
    quantity: number;
    description: string;
  }>;
  instructions: string;
  tags: string[];
}
