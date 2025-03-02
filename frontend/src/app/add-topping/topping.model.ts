export interface Topping{
    _id: string;
    name:string;
    ingredients: { quantity: number; description: string }[];
    instructions: string;
    quantity: number;
}