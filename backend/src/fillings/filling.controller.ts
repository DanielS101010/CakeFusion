import { Controller, Post, Get, Body, Param, Patch, Delete} from "@nestjs/common";
import { FillingService } from "./filling.service";

@Controller("/filling")
export class FillingController{
    constructor(private readonly fillingService: FillingService) {    }

    @Post()
    async addFilling(
        @Body("Name") fillingsName: string,
        @Body("Ingredients") fillingsIngredients: string,
        @Body("Instructions") fillingsInstructions: string,
        @Body("Quantity") fillingQuantity: number,
    ){
        const result = await this.fillingService.addFilling(fillingsName, fillingsIngredients, fillingsInstructions, fillingQuantity)
        return {data: result };
    }

    @Get()
    async getAllFilling(){
        const fillings = await this.fillingService.getAllFillings()
        return [...fillings]
    }

    @Get(':id')
    async getSingleFilling(
        @Param('id') id: string
    
    ){
        const fillings = await this.fillingService.getSingleFilling(id)
        return fillings
    }

    @Patch()
    async updateFilling(
        @Body('Id') id: string,
        @Body("Name") fillingName: string,
        @Body("Ingredients") fillingIngredients: string,
        @Body("Instructions") fillingInstructions: string,
        @Body("Quantity") fillingQuantity: number,
    ){
        const res = await this.fillingService.updateFilling(id, fillingName, fillingIngredients, fillingInstructions, fillingQuantity)
        return res
    }
    
        
    @Delete(':id')
    async deleteDough(
        @Param('id') id: string
    ){
        await this.fillingService.deleteFilling(id)
        return null
    }
}