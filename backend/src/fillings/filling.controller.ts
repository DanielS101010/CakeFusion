import { Controller, Post, Get, Body, Param, Patch, Delete} from "@nestjs/common";
import { FillingService } from "./filling.service";
import { UpdateFillingDTO } from "./update-fillings.dto";
import { CreateFillingDTO } from "./create-fillings.dto";

@Controller("/filling")
export class FillingController{
    constructor(private readonly fillingService: FillingService){}

    @Post()
    async addFilling(@Body() createFillingDTO: CreateFillingDTO){
        const {name, ingredients, instructions, quantity } = createFillingDTO;
        const res = await this.fillingService.addFilling(name, ingredients, instructions, quantity);
        return {data: res };
    }

    @Get()
    async getAllFilling(){
        const fillings = await this.fillingService.getAllFillings()
        return [...fillings]
    }

    @Get(':id')
    async getSingleFilling(@Param('id') id: string){
        const fillings = await this.fillingService.getSingleFilling(id)
        return fillings
    }

    @Patch()
    async updateFilling(@Body() updateFillingDTO: UpdateFillingDTO){
        const { id, name, ingredients, instructions, quantity } = updateFillingDTO;
        const res = await this.fillingService.updateFilling(id, name, ingredients, instructions, quantity);
        return res
    }
    
    @Delete(':id')
    async deleteDough(@Param('id') id: string){
        await this.fillingService.deleteFilling(id)
        return null
    }
}