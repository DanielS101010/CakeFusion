import { Module } from "@nestjs/common";
import { CakeController } from "./cake.controller";
import { CakeService } from "./cake.service";
import { MongooseModule } from "@nestjs/mongoose";
import { CakeSchema } from "./cake.model";

@Module({
    imports: [MongooseModule.forFeature([{name: 'Cake', schema: CakeSchema}])],
    controllers:[CakeController],
    providers:[CakeService],
})

export class CakeModule{}