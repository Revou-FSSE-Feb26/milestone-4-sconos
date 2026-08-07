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

  updateCategory(id: number, dto: UpdateCategoryDto) {
    const category = this.categoriesRepository.getOneCategory(id);

    if (!category) return new NotFoundException();

    return this.categoriesRepository.updateCategory(id, dto);
  }

  deleteCategory(id: number) {
    const category = this.categoriesRepository.getOneCategory(id);

    if (!category) return new NotFoundException();

    return this.categoriesRepository.deleteCategory(id);
  }
}
