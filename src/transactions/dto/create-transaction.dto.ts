import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TransactionType } from '../transaction-type.enum';

export class CreateTransactionDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  @IsPositive()
  account_id!: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  @IsPositive()
  category_id!: number;

  @ApiProperty({ enum: TransactionType, example: Object.values(TransactionType)[0] })
  @IsEnum(TransactionType)
  type!: TransactionType;

  @ApiProperty({ example: 50000 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  amount!: number;

  @ApiPropertyOptional({ example: 'Lunch with client' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: '2026-08-05' })
  @IsDateString()
  transaction_date!: string;
}