import { Controller, Post, Get, Body, Param, Patch, Delete } from "@nestjs/common";
import { CakeService } from "./cake.service";

@Controller("/cake")
export class CakeController {
  constructor(private readonly cakeService: CakeService) {}

  @Post()
  async addCake(
    @Body("Name") cakeName: string,
    @Body("Components") components: Array<{ type: string; id: string; quantity: number; }>,
    @Body("Ingredients") ingredients: string,
    @Body("Instructions") instructions: string
  ) {
    const result = await this.cakeService.addCake(
      cakeName,
      components,
      ingredients,
      instructions
    );
    return { data: result };
  }

  @Get()
  async getAllCake() {
    const cakes = await this.cakeService.getAllCakes();
    return [...cakes];
  }

  @Get(':id')
  async getSingleCake(
    @Param('id') id: string
  ) {
    const cake = await this.cakeService.getSingleCake(id);
    return cake;
  }

  @Patch()
  async updateCake(
    @Body('id') id: string,
    @Body("Name") cakeName: string,
    @Body("Components") components: Array<{ type: string; id: string, quantity: number; }>,
    @Body("Ingredients") ingredients: string,
    @Body("Instructions") instructions: string
  ) {
    const result = await this.cakeService.updateCake(
      id,
      cakeName,
      components,
      ingredients,
      instructions
    );
    return { data: result };
  }

  @Delete(':id')
  async deleteCake(
    @Param('id') id: string
  ) {
    await this.cakeService.deleteCake(id);
    return null;
  }
}
