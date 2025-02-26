import { Module } from "@nestjs/common";
import { ToppingController } from "./topping.controller";
import { ToppingService } from "./topping.service";
import { MongooseModule } from "@nestjs/mongoose";
import { ToppingSchema } from "./topping.model";

@Module({
    imports: [MongooseModule.forFeature([{name: 'Topping', schema: ToppingSchema}])],
    controllers:[ToppingController],
    providers:[ToppingService],
})

export class ToppingModule{}