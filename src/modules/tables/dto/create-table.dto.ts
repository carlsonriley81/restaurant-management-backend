import { IsNumber, IsString, IsOptional, IsEnum, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TableStatus } from '@prisma/client';

export class CreateTableDto {
  @ApiProperty()
  @IsNumber()
  @Min(1)
  tableNumber: number;

  @ApiProperty()
  @IsNumber()
  @Min(1)
  capacity: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  color?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  positionX?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  positionY?: number;
}

export class UpdateTableStatusDto {
  @ApiProperty({ enum: TableStatus })
  @IsEnum(TableStatus)
  status: TableStatus;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  serverId?: string;
}
