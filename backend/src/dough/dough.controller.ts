import { Controller, Post, Get, Body, Param, Patch, Delete} from "@nestjs/common";
import { DoughService } from "./dough.service";

@Controller("/dough")
export class DoughController{
    constructor(private readonly doughService: DoughService) {}

    @Post()
    async addDough(
        @Body("Name") doughName: string, 
        @Body("Ingredients") doughIngredients: string, 
        @Body("Instructions") doughInstructions: string,
        @Body("Quantity") doughQuantity: number,
    ){
        const result = await this.doughService.addDough(doughName, doughIngredients, doughInstructions, doughQuantity)
        return {data: result };
    }

    @Get()
    async getAllDough(){
        const doughs = await this.doughService.getAllDoughs()
        return [...doughs]
    }

    @Get(':id')
    async getSingleDough(
        @Param('id') id: string
    ){
        const dough = await this.doughService.getSingleDough(id)
        return dough
    }

    @Patch()
    async updateDough(
        @Body('Id') id: string, 
        @Body("Name") doughName: string, 
        @Body("Ingredients") doughIngredients: string, 
        @Body("Instructions") doughInstructions: string,
        @Body("Quantity") doughQuantity: number,
    ){
        const res = await this.doughService.updateDough(id, doughName, doughIngredients, doughInstructions, doughQuantity)
        return res
    }
    
    @Delete(':id')
    async deleteDough(
        @Param('id') id: string
    ){
        await this.doughService.deleteDough(id)
        return null
    }
}