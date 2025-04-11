import { Controller, Post, Get, Body, Param, Delete, Patch} from "@nestjs/common";
import { ToppingService } from "./topping.service";
import { CreateToppingDTO } from "./dto/create-toppings.dto";
import { UpdateToppingDTO } from "./dto/update-toppings.dto";

@Controller("/topping")
export class ToppingController{
    constructor(private readonly toppingService: ToppingService){}

    @Post()
    async addTopping(@Body() createToppingsDTO: CreateToppingDTO){
        const {name, ingredients, instructions, quantity, tags } = createToppingsDTO;

        const result = await this.toppingService.addTopping(name, ingredients, instructions, quantity, tags)
        return {data: result };
    }

    @Get()
    async getAllTopping(){
        const toppings = await this.toppingService.getAllToppings()
        return { data: toppings };
    }
    @Get(':id')
    async getSingleTopping(
        @Param('id') id: string
    ){
        const topping = await this.toppingService.getSingleTopping(id)
        return { data: topping };
    }

    @Patch()
    async updateTopping(@Body() updateToppingsDTO: UpdateToppingDTO){
        const {id, name, ingredients, instructions, quantity, tags } = updateToppingsDTO;

        const result = await this.toppingService.updateTopping(id, name, ingredients, instructions, quantity, tags)
        return { data: result };
    }
    
    @Delete(':id')
    async deleteTopping(
        @Param('id') id: string
    ){
        await this.toppingService.deleteTopping(id)
        return { data: null };
    }    
}