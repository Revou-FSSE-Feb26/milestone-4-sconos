import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'John Doe', maxLength: 100 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name!: string;

  @ApiProperty({ example: 'john@example.com', maxLength: 100 })
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(100)
  email!: string;

  @ApiProperty({ example: 'password123', minLength: 8, maxLength: 100 })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(100)
  password!: string;

  @ApiPropertyOptional({ example: 'admin', maxLength: 20 })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  role?: string;
}