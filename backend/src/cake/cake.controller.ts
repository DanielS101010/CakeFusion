import { Controller, Post, Get, Body, Param, Patch, Delete } from "@nestjs/common";
import { CakeService } from "./cake.service";
import { CreateCakeDTO } from "./dto/create-cake.dto";
import { UpdateCakeDTO } from "./dto/update-cake.dto";

@Controller("/cake")
export class CakeController {
  constructor(private readonly cakeService: CakeService) {}

  @Post()
  async addCake(@Body() createCakeDTO: CreateCakeDTO){
    const {name, components, ingredients, instructions } = createCakeDTO;
    const result = await this.cakeService.addCake(name, components, ingredients,instructions);
    return { data: result };
  }

  @Get()
  async getAllCake() {
    const cakes = await this.cakeService.getAllCakes();
    return { data: cakes };
  }

  @Get(':id')
  async getSingleCake(@Param('id') id: string) {
    const cake = await this.cakeService.getSingleCake(id);
    return { data: cake };
  }

  @Patch()
  async updateCake(@Body() updateCakeDTO: UpdateCakeDTO) {
    const {id, name, components, ingredients, instructions } = updateCakeDTO;
    const result = await this.cakeService.updateCake(id, name, components, ingredients, instructions );
    return { data: result };
  }

  @Delete(':id')
  async deleteCake(@Param('id') id: string) {
    await this.cakeService.deleteCake(id);
    return { data: null };
  }
}
