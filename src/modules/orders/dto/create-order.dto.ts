import { IsString, IsArray, IsOptional, ValidateNested, IsNumber, Min, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { PaymentMethod } from '@prisma/client';

export class CreateOrderItemDto {
  @ApiProperty()
  @IsString()
  menuItemId: string;

  @ApiProperty()
  @IsNumber()
  @Min(1)
  quantity: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class CreateOrderDto {
  @ApiProperty({ type: [CreateOrderItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  tableId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  customerName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  customerPhone?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  customerEmail?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  discountId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  tipAmount?: number;
}

export class UpdateOrderStatusDto {
  @ApiProperty()
  @IsString()
  status: string;
}

export class ProcessPaymentDto {
  @ApiProperty({ enum: PaymentMethod })
  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  tipAmount?: number;
}
