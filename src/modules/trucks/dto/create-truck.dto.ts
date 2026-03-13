import { IsString, IsOptional, IsDateString, IsArray, IsNumber, ValidateNested, IsBoolean, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class TruckItemDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  inventoryId?: string;

  @ApiProperty()
  @IsString()
  productName: string;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  quantity: number;

  @ApiProperty({ required: false, default: 'units' })
  @IsOptional()
  @IsString()
  unit?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  unitCost?: number;
}

export class CreateTruckDto {
  @ApiProperty()
  @IsString()
  truckNumber: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  estimatedArrival?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  freightType?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({ type: [TruckItemDto], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TruckItemDto)
  items?: TruckItemDto[];
}

export class ReceiveTruckItemDto {
  @ApiProperty()
  @IsString()
  itemId: string;

  @ApiProperty()
  @IsBoolean()
  received: boolean;
}
