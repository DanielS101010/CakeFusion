import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { parseIngredients } from '../shared-service/shared-service.service';
import { Dough } from "./dough.model";


@Injectable()
export class DoughService{

    constructor(@InjectModel("Dough") private doughModel: Model<Dough>){}

    async addDough(
        name: string,
        ingredients: string,
        instructions: string,
        quantity: number,
        tags: string[],
        image: string
    ){
        const ingredientList = parseIngredients(ingredients)
 
        const newDough = new this.doughModel({name: name, ingredients: ingredientList, instructions: instructions, quantity:quantity, tags:tags, image: image})
        
        const result = await newDough.save();
        return result._id;
    }

    async getAllDoughs(){
        const Doughs = await this.doughModel.find();
        return Doughs as Dough[];
    }

    async getSingleDough(id: String){
        const dough = await this.doughModel.findById(id)
        if (!dough){
            throw new NotFoundException("Dough with id ${id} not found")
        }
        return dough
    }
    
    async updateDough(
        id: string,
        name: string, 
        ingredients: string, 
        instructions: string,
        quantity: number,
        tags: string[],
        image: string
    ){
        const ingredientList = parseIngredients(ingredients)

        const result = await this.doughModel.findByIdAndUpdate(id, {name: name, ingredients: ingredientList, instructions: instructions, quantity: quantity, tags:tags, image: image})
        return result
    }

    async deleteDough(
        id:string
    ){
        await this.doughModel.findByIdAndDelete(id)
    }
}