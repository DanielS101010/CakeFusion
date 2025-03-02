import { Controller, Post, Get, Body, Param, Patch, Delete} from "@nestjs/common";
import { DoughService } from "./dough.service";
import { CreateDoughDTO } from "./create-dough.dto";
import { UpdateDoughDTO } from "./update-dough.dto";

@Controller("/dough")
export class DoughController{
    constructor(private readonly doughService: DoughService) {}

    @Post()
    async addDough(@Body() createDoughDTO: CreateDoughDTO){
        const { name, ingredients, instructions, quantity } = createDoughDTO;
        const result = await this.doughService.addDough(name, ingredients, instructions, quantity)
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
    async updateDough(@Body() updateDoughDTO: UpdateDoughDTO) {
        const { id, name, ingredients, instructions, quantity } = updateDoughDTO;
        console.log(quantity)
        const res = await this.doughService.updateDough(id, name, ingredients, instructions, quantity);
        return res;
    }
    
    @Delete(':id')
    async deleteDough(
        @Param('id') id: string
    ){
        await this.doughService.deleteDough(id)
        return null
    }
}