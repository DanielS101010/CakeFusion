import { Controller, Post, Get, Body, Param, Delete, Patch} from "@nestjs/common";
import { ToppingService } from "./topping.service";

@Controller("/topping")
export class ToppingController{
    constructor(private readonly toppingService: ToppingService) {    }

    @Post()
    async addTopping(
        @Body("Name") toppingName: string,
        @Body("Ingredients") toppingIngredients: string,
        @Body("Instructions") toppingInstructions: string,
        @Body("Quantity") toppingQuantity: number)
        {
        const result = await this.toppingService.addTopping(toppingName, toppingIngredients, toppingInstructions, toppingQuantity)
        return {data: result };
    }

    @Get()
    async getAllTopping(){
        const toppings = await this.toppingService.getAllToppings()
        return [...toppings]
    }
    @Get(':id')
    async getSingleTopping(
        @Param('id') id: string
    ){
        const toppings = await this.toppingService.getSingleTopping(id)
        return toppings
    }

    @Patch()
    async updateFilling(
        @Body('id') id: string,
        @Body("Name") fillingName: string,
        @Body("Ingredients") fillingIngredients: string,
        @Body("Instructions") fillingInstructions: string,
        @Body("Quantity") quantity: number,
    ){
        const res = await this.toppingService.updateTopping(id, fillingName, fillingIngredients, fillingInstructions, quantity)
        return res
    }
    
    @Delete(':id')
    async deleteTopping(
        @Param('id') id: string
    ){
        await this.toppingService.deleteTopping(id)
        return null
    }    
}