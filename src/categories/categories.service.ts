import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CategoriesRepository } from './categories.repository';

@Injectable()
export class CategoriesService {
  constructor(private readonly categoriesRepository: CategoriesRepository) {}
  getAllCategories() {
    return this.categoriesRepository.getAllCategories();
  }

  getOneCategory(id: number) {
    return this.categoriesRepository.getOneCategory(id);
  }

  createCategory(dto: CreateCategoryDto) {
    return this.categoriesRepository.createCategory(dto);
  }

  async updateCategory(id: number, dto: UpdateCategoryDto) {
    return this.categoriesRepository.updateCategory(id, dto);
  }

  async deleteCategory(id: number) {
    return this.categoriesRepository.deleteCategory(id);
  }
}
