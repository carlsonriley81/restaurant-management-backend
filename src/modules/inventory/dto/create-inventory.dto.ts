import { IsString, IsNumber, IsOptional, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateInventoryDto {
  @ApiProperty()
  @IsString()
  productName: string;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  quantityOnHand: number;

  @ApiProperty({ required: false, default: 'units' })
  @IsOptional()
  @IsString()
  unit?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  lowStockThreshold?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  supplierName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  costToOrder?: number;
}

export class UpdateInventoryQuantityDto {
  @ApiProperty()
  @IsNumber()
  quantity: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  unit?: string;
}
