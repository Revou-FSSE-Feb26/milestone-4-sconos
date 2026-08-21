import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesRepository {
  constructor(private readonly prisma: PrismaService) {}

  getAllCategories() {
    return this.prisma.category.findMany();
  }

  async getOneCategory(id: number) {
    const find = await this.prisma.category.findUnique({ where: { id } });
    if (!find) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return find;
  }

  createCategory(dto: CreateCategoryDto) {
    return this.prisma.category.create({ data: dto });
  }

  async updateCategory(id: number, dto: UpdateCategoryDto) {
    await this.getOneCategory(id);
    return this.prisma.category.update({ where: { id }, data: dto });
  }

  async deleteCategory(id: number) {
    await this.getOneCategory(id);
    await this.prisma.category.delete({ where: { id } });
    return { message: 'Record deleted', status: 200, id };
  }
}