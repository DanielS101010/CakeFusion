import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { Filling } from "./filling.model";
import { parseIngredients } from '../shared-service/shared-service.service';


@Injectable()
export class FillingService{

    constructor(@InjectModel("Filling") private fillingModel: Model<Filling>){}

    async addFilling(
        name: string,
        ingredients: string,
        instructions: string,
        quantity: number,
        tags: string[],
    ){
        const ingredientList = parseIngredients(ingredients)
        
        const newFilling = new this.fillingModel({name: name, ingredients: ingredientList, instructions: instructions, quantity: quantity, tags: tags})
        const result = await newFilling.save();
        return result._id;
    }

    async getAllFillings(){
        const Fillings = await this.fillingModel.find();
        return Fillings as Filling[];
    }

    async getSingleFilling(
        id: String
    ){
        const filling = await this.fillingModel.findById(id)
        if (!filling){
            throw new NotFoundException("Filling with id ${id} not found")
        }
        return filling
    }

    async updateFilling(
        id: string,
        name: string,
        ingredients: string,
        instructions: string,
        quantity: number,
    ){
        const ingredientList = parseIngredients(ingredients)
        const result = await this.fillingModel.findByIdAndUpdate(id, {name: name, ingredients: ingredientList, instructions: instructions, quantity: quantity})
        return result
    }

    async deleteFilling(
        id:string
    ){
        await this.fillingModel.findByIdAndDelete(id)
    }
}