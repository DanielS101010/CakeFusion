import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Tag } from './tag.model';

@Injectable()
export class TagsService {

  constructor(@InjectModel("Tags") private tagModel: Model<Tag>){}


  async addTag(tagName: string) {
    const newTag = new this.tagModel({name: tagName})
    const result = await newTag.save()
    return result._id;
  }

  async getAllTags() {
    const tags = await this.tagModel.find();
    return tags;
  }

  async getSingleTag(id: string) {
    const tag = await this.tagModel.findById(id);
    return tag;
  }

  async updateTag(
    id: string,
    name: string, 
    ){
      const result = await this.tagModel.findByIdAndUpdate(id, {name: name})
      return result
    }


  async deleteTag(id: string) {
    await this.tagModel.findByIdAndDelete(id);
  }
}
