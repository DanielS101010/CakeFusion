export interface Dough{
    _id: string;
    name:string;
    ingredients: { quantity: number; description: string }[];
    instruction: string;
    quantity: number;
}