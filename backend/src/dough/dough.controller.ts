import { Controller, Post, Get, Body, Param, Patch, Delete } from "@nestjs/common";
import { DoughService } from "./dough.service";
import { CreateDoughDTO } from "./dto/create-dough.dto";
import { UpdateDoughDTO } from "./dto/update-dough.dto";

@Controller("/dough")
export class DoughController {
    constructor(private readonly doughService: DoughService) {}

    @Post()
    async addDough(@Body() createDoughDTO: CreateDoughDTO) {
        const { name, ingredients, instructions, quantity, tags, image } = createDoughDTO;
        const result = await this.doughService.addDough(name, ingredients, instructions, quantity, tags, image);
        return { data: result };
    }

    @Get()
    async getAllDough() {
        const doughs = await this.doughService.getAllDoughs();
        return { data: doughs };
    }

    @Get(':id')
    async getSingleDough(@Param('id') id: string) {
        const dough = await this.doughService.getSingleDough(id);
        return { data: dough };
    }

    @Patch()
    async updateDough(@Body() updateDoughDTO: UpdateDoughDTO) {
        const { id, name, ingredients, instructions, quantity, tags, image } = updateDoughDTO;
        const result = await this.doughService.updateDough(id, name, ingredients, instructions, quantity, tags, image);
        return { data: result };
    }
    
    @Delete(':id')
    async deleteDough(@Param('id') id: string) {
        await this.doughService.deleteDough(id);
        return { data: null };
    }
}
