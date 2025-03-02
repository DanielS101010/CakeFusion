export interface Filling{
    _id: string;
    name:string;
    ingredients: { quantity: number; description: string }[];
    instructions: string;
    quantity: number;
}