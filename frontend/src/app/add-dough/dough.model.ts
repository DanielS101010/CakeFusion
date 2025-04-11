export interface Dough{
    _id: string;
    name:string;
    ingredients: { quantity: number; description: string }[];
    instructions: string;
    quantity: number;
    tags: string[];
}