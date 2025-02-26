export interface Dough{
    _id: string;
    name:string;
    category: string;
    ingredients: { quantity: number; description: string }[];
    instruction: string;
    quantity: number;
}