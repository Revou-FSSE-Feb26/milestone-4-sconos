import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { account_type } from 'generated/prisma/browser';

export class CreateAccountDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  @IsPositive()
  user_id!: number;

  @ApiProperty({ example: 'Main Wallet', maxLength: 100 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name!: string;

  @ApiProperty({ enum: account_type, example: Object.values(account_type)[0] })
  @IsEnum(account_type)
  type!: account_type;

  @ApiPropertyOptional({ example: 500000, minimum: 0 })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  balance?: number;
}