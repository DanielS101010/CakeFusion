import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { Topping } from "./topping.model";
import { parseIngredients } from "src/shared-service/shared-service.service";


@Injectable()
export class ToppingService{

    constructor(@InjectModel("Topping") private toppingModel: Model<Topping>){}

    async addTopping(
        name: string,
        ingredients: string,
        instruction: string,
        quantity: number,
    ){
        const ingredientList = parseIngredients(ingredients)

        const newTopping = new this.toppingModel({name: name, ingredients: ingredientList, instruction: instruction, quantity: quantity})
        const result = await newTopping.save();
        return result._id;
    }

    async getAllToppings(){
        const Toppings = await this.toppingModel.find();
        return Toppings as Topping[];
    }

    async getSingleTopping(
        id: String
    
    ){
        const topping = await this.toppingModel.findById(id)
        if (!topping){
            throw new NotFoundException("Topping with id ${id} not found")
        }
        return topping
    }

    async updateTopping(
        id: string,
        name: string,
        ingredients: string,
        instruction: string,
        quantity: number,
    ){
        const ingredientList = parseIngredients(ingredients)

        const res = await this.toppingModel.findByIdAndUpdate(id, {name: name, ingredients: ingredientList, instruction: instruction, quantity:quantity})
        return res
    }

    async deleteTopping(
        id:string
    ){
        await this.toppingModel.findByIdAndDelete(id)
    }
}