import { IsString, IsDateString, IsNumber, IsOptional, IsArray, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReservationDto {
  @ApiProperty()
  @IsString()
  reservationName: string;

  @ApiProperty()
  @IsDateString()
  reservationTime: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  reservationType?: string;

  @ApiProperty()
  @IsNumber()
  @Min(1)
  partySize: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  tableIds?: string[];

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
  @IsNumber()
  @Min(0)
  depositPaid?: number;
}
