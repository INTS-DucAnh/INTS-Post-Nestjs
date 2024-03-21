import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Categories } from 'src/entity/category.entity';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/category-create.dto';
import { CategoryDto } from './dto/category.dto';
import { MESSAGE_CONSTANT } from 'src/config/app.constant';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Categories)
    private categoryRepository: Repository<Categories>,
  ) {}

  async isValidCategory(id: number) {
    const existCategory = await this.findById(id);
    if (!existCategory)
      throw new BadRequestException(
        MESSAGE_CONSTANT.targetNonExist('category'),
      );
    return existCategory;
  }

  findById(id: number) {
    return this.categoryRepository.findOneBy({ id: id });
  }

  createCategory(createCategory: CreateCategoryDto) {
    return this.categoryRepository.save(createCategory);
  }

  updateCategory(updateCategory: CategoryDto) {
    return this.categoryRepository.save(updateCategory);
  }

  deleteCategory(id: number) {
    return this.categoryRepository.softDelete({ id: id });
  }

  async findCategory(skip: number = 0, limit: number = 10) {
    const query = this.categoryRepository
      .createQueryBuilder('categories')
      .withDeleted()
      .innerJoinAndSelect('categories.usersUpdate', 'users1')
      .withDeleted()
      .innerJoinAndSelect('categories.usersCreate', 'users2')
      .select([
        'categories.id',
        'categories.title',
        'categories.createat',
        'categories.updateat',
        'users1.username',
        'users1.avatar',
        'users1.firstname',
        'users1.lastname',
        'users2.username',
        'users2.avatar',
        'users2.firstname',
        'users2.lastname',
      ])
      .where('categories.deletedat IS NULL');

    return {
      categories: await query.orderBy('categories.id', 'ASC').getMany(),
      count: await query.getCount(),
    };
  }
}
