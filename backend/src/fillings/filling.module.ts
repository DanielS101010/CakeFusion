import { Module } from "@nestjs/common";
import { FillingController } from "./filling.controller";
import { FillingService } from "./filling.service";
import { MongooseModule } from "@nestjs/mongoose";
import { FillingSchema } from "./filling.model";

@Module({
    imports: [MongooseModule.forFeature([{name: 'Filling', schema: FillingSchema}])],
    controllers:[FillingController],
    providers:[FillingService],
})

export class FillingModule{}