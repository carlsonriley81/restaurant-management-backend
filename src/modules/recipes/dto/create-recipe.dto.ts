import { IsString, IsArray, IsOptional, IsBoolean, IsNumber, ValidateNested, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class RecipeIngredientDto {
  @ApiProperty()
  @IsString()
  inventoryId: string;

  @ApiProperty()
  @IsString()
  ingredientName: string;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  amount: number;

  @ApiProperty()
  @IsString()
  unit: string;
}

export class CreateRecipeDto {
  @ApiProperty()
  @IsString()
  dishName: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  dishImage?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  limitedTime?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Min(1)
  servingSize?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  instructions?: string;

  @ApiProperty({ type: [RecipeIngredientDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RecipeIngredientDto)
  ingredients: RecipeIngredientDto[];
}
