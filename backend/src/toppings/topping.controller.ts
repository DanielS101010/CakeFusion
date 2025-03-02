import { Controller, Post, Get, Body, Param, Delete, Patch} from "@nestjs/common";
import { ToppingService } from "./topping.service";
import { CreateToppingsDTO } from "./create-toppings.dto";
import { UpdateToppingsDTO } from "./update-toppings.dto";

@Controller("/topping")
export class ToppingController{
    constructor(private readonly toppingService: ToppingService){}

    @Post()
    async addTopping(@Body() createToppingsDTO: CreateToppingsDTO){
        const {name, ingredients, instructions, quantity } = createToppingsDTO;

        const result = await this.toppingService.addTopping(name, ingredients, instructions, quantity)
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
    async updateFilling(@Body() updateToppingsDTO: UpdateToppingsDTO){
        const {id, name, ingredients, instructions, quantity } = updateToppingsDTO;

        const res = await this.toppingService.updateTopping(id, name, ingredients, instructions, quantity)
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