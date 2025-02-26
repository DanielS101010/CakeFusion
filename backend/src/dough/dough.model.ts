import * as mongoose from 'mongoose'

export const DoughSchema = new mongoose.Schema({
    name: {type: String, required: true},
    category: {type: String, required: true},
    ingredients: [{
        quantity: { type: Number, required: true },
        description: { type: String, required: true }
      }],
    instruction: {type: String, required: true},
    quantity: {type: Number, required: true},
});

export interface Dough{
    id: string;
    name:string;
    category: string;
    ingredients: { quantity: number; description: string }[];
    instruction: string;
    quantity: number;
}