import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { Cake } from "./cake.model";
import { parseIngredients } from "../shared-service/shared-service.service";

@Injectable()
export class CakeService {
  constructor(@InjectModel("Cake") private cakeModel: Model<Cake>) {}

  async addCake(
    name: string,
    components: Array<{ type: string; id: string, quantity: number }>,
    ingredients: string,
    instruction: string
  ) {
    let ingredientList: { quantity: number; description: string; }[]
    if (ingredients != ""){
      ingredientList = parseIngredients(ingredients)
    }
    
    const newCake = new this.cakeModel({
      name,
      components,
      ingredients: ingredientList,
      instructions: instruction,
    });

    const result = await newCake.save();
    return result._id;
  }

  async getAllCakes() {
    const cakes = await this.cakeModel.find();

    return cakes as Cake[];
  }

  async getSingleCake(
    id: string
  ) {
    const cake = await this.cakeModel.findById(id);
    if (!cake){
      throw new NotFoundException("Cake with id ${id} not found")
    }
    return cake;
  }

  async updateCake(
    id: string,
    name: string,
    components: Array<{ type: string; id: string; quantity: number; }>,
    ingredients: string,
    instruction: string
  ) {

    let ingredientList: { quantity: number; description: string; }[]
    if (ingredients != ""){
      ingredientList = parseIngredients(ingredients)
    }

    const result = await this.cakeModel.findByIdAndUpdate(id, {
      name,
      components,
      ingredients: ingredientList,
      instructions: instruction,
    });
    return result;
  }

  async deleteCake(
    id: string
  ) {
    await this.cakeModel.findByIdAndDelete(id);
  }
}
