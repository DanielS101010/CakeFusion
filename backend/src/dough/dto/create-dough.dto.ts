import { Transform } from 'class-transformer';
import { IsString, IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CreateDoughDTO {
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
}
