import { Module } from '@nestjs/common';
import { TagsService } from './tags.service';
import { TagsController } from './tags.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { TagSchema } from './tag.model';

@Module({
  imports: [MongooseModule.forFeature([{name: 'Tags', schema: TagSchema}])],
  controllers: [TagsController],
  providers: [TagsService],
})

export class TagsModule {}
