import { IsString, IsNotEmpty, IsArray, ValidateNested, IsOptional, IsIn, IsNumber} from 'class-validator';
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

export class UpdateCakeDTO {
  @IsString()
  @IsNotEmpty()
  id: string;

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

  @IsArray()
  tags: string[];

  @IsString()
  image: string;
}
