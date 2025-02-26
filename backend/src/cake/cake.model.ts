import * as mongoose from 'mongoose';

export const CakeSchema = new mongoose.Schema({
  Name: { type: String, required: true },
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
  ingredients: { type: String, required: false },
  instructions: { type: String, required: false },
});

export interface Cake {
  id: string;
  Name: string;
  components: Array<{
    type: 'dough' | 'filling' | 'topping';
    id: string;
    quantity: number;
  }>;
  ingredients: string;
  instructions: string;
}
