import * as mongoose from 'mongoose'

export const ToppingSchema = new mongoose.Schema({
    Name: {type: String, required: true},
    ingredients: [{
        quantity: { type: Number, required: true },
        description: { type: String, required: true }
      }],
    instruction: {type: String, required: true},
    quantity: {type: Number, required: true}
});

export interface Topping{
    id: string;
    Name:string;
    ingredients: { quantity: number; description: string }[];
    instruction: string;
    quantity: number;
}