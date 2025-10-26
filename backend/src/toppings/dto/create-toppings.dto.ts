import { Transform } from 'class-transformer';
import { IsString, IsNotEmpty, IsNumber, Min, IsArray } from 'class-validator';

export class CreateToppingDTO {
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
  @IsNumber()
  @Min(1)
  quantity: number;

  @IsArray()
  tags: string[];

  @IsString()
  image: string;
}
