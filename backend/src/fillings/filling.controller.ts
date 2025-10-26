import { Controller, Post, Get, Body, Param, Patch, Delete} from "@nestjs/common";
import { FillingService } from "./filling.service";
import { UpdateFillingDTO } from "./dto/update-fillings.dto";
import { CreateFillingDTO } from "./dto/create-fillings.dto";

@Controller("/filling")
export class FillingController{
    constructor(private readonly fillingService: FillingService){}

    @Post()
    async addFilling(@Body() createFillingDTO: CreateFillingDTO){
        const {name, ingredients, instructions, quantity, tags, image } = createFillingDTO;
        const result = await this.fillingService.addFilling(name, ingredients, instructions, quantity, tags, image);
        return {data: result };
    }

    @Get()
    async getAllFilling(){
        const fillings = await this.fillingService.getAllFillings()
        return { data: fillings };
    }

    @Get(':id')
    async getSingleFilling(@Param('id') id: string){
        const fillings = await this.fillingService.getSingleFilling(id)
        return { data: fillings };
    }

    @Patch()
    async updateFilling(@Body() updateFillingDTO: UpdateFillingDTO){
        const { id, name, ingredients, instructions, quantity, tags, image } = updateFillingDTO;
        const result = await this.fillingService.updateFilling(id, name, ingredients, instructions, quantity, tags, image);
        return { data: result };
    }
    
    @Delete(':id')
    async deleteFilling(@Param('id') id: string){
        await this.fillingService.deleteFilling(id)
        return { data: null };
    }
}