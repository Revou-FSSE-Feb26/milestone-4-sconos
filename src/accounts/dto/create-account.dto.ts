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
import { AccountType } from '../account-type.enum';

export class CreateAccountDto {
  @ApiProperty({ example: 'Main Wallet', maxLength: 100 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name!: string;

  @ApiProperty({ enum: AccountType, example: Object.values(AccountType)[0] })
  @IsEnum(AccountType)
  type!: AccountType;

  @ApiPropertyOptional({ example: 500000, minimum: 0 })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  balance?: number;
}