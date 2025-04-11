import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TagsService } from './tags.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';

@Controller('/tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Post()
  async addTag(@Body() createTagDto: CreateTagDto) {
    const {name} = createTagDto;
    const result = await this.tagsService.addTag(name);
    return  { data: result };

  }

  @Get()
  async getAllTags() {
    const tags = await this.tagsService.getAllTags();
    return { data: tags };
  }

  @Get(':id')
  async getSingleTag(@Param('id') id: string) {
    const tag = await this.tagsService.getSingleTag(id);
    return { data: tag };
  }

  @Patch()
  async updateTag(@Body() updateTagDto: UpdateTagDto) {
    const {id, name} = updateTagDto;
    const res = await this.tagsService.updateTag(id, name);
    return {data: res}
  }

  @Delete(':id')
  async deleteTag(@Param('id') id: string) {
    const res = await this.tagsService.deleteTag(id);
    return {data: res}
  }
}
