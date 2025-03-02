import { IsString, IsNotEmpty, IsArray, ValidateNested, IsOptional, IsIn, IsNumber, isString} from 'class-validator';
import { Type } from 'class-transformer';

class ComponentDTO {
  @IsString()
  @IsNotEmpty()
  @IsIn(['dough', 'filling', 'topping'])
  type: 'dough' | 'filling' | 'topping';

  @IsString()
  @IsNotEmpty()
  id: string;

  @Type(() => Number)
  @IsNumber()
  quantity: number;
}

export class CreateCakeDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ComponentDTO)
  components: ComponentDTO[];

  @IsString()
  ingredients: string;

  @IsString()
  @IsOptional()
  instructions?: string;
}
