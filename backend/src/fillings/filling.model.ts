import * as mongoose from 'mongoose'

export const FillingSchema = new mongoose.Schema({
    name: {type: String, required: true},
    ingredients: [{
        quantity: { type: Number, required: true },
        description: { type: String, required: true }
      }],
    instruction: {type: String, required: true},
    quantity:{type: Number, required:true},
});

export interface Filling{
    id: string;
    name:string;
    ingredients: { quantity: number; description: string }[];
    instruction: string;
    quantity: number;
}