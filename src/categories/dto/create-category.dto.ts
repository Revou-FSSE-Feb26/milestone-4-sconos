import { IsEnum, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CategoryType } from '../category-type.enum';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Groceries', maxLength: 100 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name!: string;

  @ApiProperty({ enum: CategoryType, example: Object.values(CategoryType)[0] })
  @IsEnum(CategoryType)
  type!: CategoryType;
}