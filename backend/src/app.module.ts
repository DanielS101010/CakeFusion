import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose'

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DoughModule } from './dough/dough.module';
import { FillingModule } from './fillings/filling.module';
import { ToppingModule } from './toppings/topping';
import { CakeModule } from './cake/cake.module';
import { TagsModule } from './tags/tags.module';


@Module({
  imports: [MongooseModule.forRoot('mongodb://localhost:27017/cake'), DoughModule, FillingModule, ToppingModule, CakeModule, TagsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
