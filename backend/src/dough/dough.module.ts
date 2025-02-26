import { Module } from "@nestjs/common";
import { DoughController } from "./dough.controller";
import { DoughService } from "./dough.service";
import { MongooseModule } from "@nestjs/mongoose";
import { DoughSchema } from "./dough.model";

@Module({
    imports: [MongooseModule.forFeature([{name: 'Dough', schema: DoughSchema}])],
    controllers:[DoughController],
    providers:[DoughService],
})

export class DoughModule{}