import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesRepository {
  constructor(private readonly prisma: PrismaService) {}

  getAllCategories() {
    return this.prisma.categories.findMany();
  }

  getOneCategory(id: number) {
    const find = this.prisma.categories.findUnique({
      where: { id },
    });

    if (!find) {
      return {
        message: 'Cannot Find Any ${id} Matching Record',
        status: 404,
        id: id,
      };
    }

    return find;
  }

  createCategory(dto: CreateCategoryDto) {
    return this.prisma.categories.create({ data: dto });
  }

  updateCategory(id: number, dto: UpdateCategoryDto) {
    return this.prisma.categories.update({
      where: { id },
      data: dto,
    });
  }

  async deleteCategory(id: number) {
    const deleted = await this.prisma.categories.delete({
      where: { id },
    });

    if (deleted) {
      return {
        message: 'Record Deleted',
        status: 203,
        id: id,
      };
    }
    return {
      message: 'Cannot Delete ${id} Record',
      status: 404,
      id: id,
    };
  }
}
