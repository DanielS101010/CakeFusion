import { Transform, Type } from 'class-transformer';
import { IsString, IsNotEmpty, IsNumber, Min, isNotEmpty } from 'class-validator';

export class UpdateToppingDTO {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  ingredients: string;

  @IsString()
  @IsNotEmpty()
  instructions: string;

  @Transform(({ value }) => {
    const normalized = value.toString().replace(',', '.');
    return parseFloat(normalized);
  })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  quantity: number;
}
