import { IsString, IsNumber, IsOptional, IsArray, ValidateNested, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class PrepInventoryItemDto {
  @ApiProperty()
  @IsString()
  inventoryId: string;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  amountUsed: number;

  @ApiProperty()
  @IsString()
  unit: string;
}

export class CreatePrepLogDto {
  @ApiProperty()
  @IsString()
  itemPrepped: string;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  servingsCreated: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  usedFor?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  requiredServings?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({ type: [PrepInventoryItemDto], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PrepInventoryItemDto)
  inventoryUsed?: PrepInventoryItemDto[];
}
