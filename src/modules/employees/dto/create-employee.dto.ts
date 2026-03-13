import { IsString, IsEmail, IsEnum, IsOptional, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role, EmployeeStatus } from '@prisma/client';

export class CreateEmployeeDto {
  @ApiProperty()
  @IsString()
  firstName: string;

  @ApiProperty()
  @IsString()
  lastName: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  password: string;

  @ApiProperty({ enum: Role })
  @IsEnum(Role)
  role: Role;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  hourlyWage: number;

  @ApiProperty({ required: false })
  @IsOptional()
  contactInfo?: any;

  @ApiProperty({ required: false })
  @IsOptional()
  emergencyContact?: any;
}

export class UpdateEmployeeDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({ required: false, enum: Role })
  @IsOptional()
  @IsEnum(Role)
  role?: Role;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  hourlyWage?: number;

  @ApiProperty({ required: false, enum: EmployeeStatus })
  @IsOptional()
  @IsEnum(EmployeeStatus)
  status?: EmployeeStatus;

  @ApiProperty({ required: false })
  @IsOptional()
  contactInfo?: any;

  @ApiProperty({ required: false })
  @IsOptional()
  emergencyContact?: any;
}
