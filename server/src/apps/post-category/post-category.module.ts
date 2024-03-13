import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Categories } from 'src/entity/category.entity';
import { PostCategory } from 'src/entity/post-category.entity';
import { Roles } from 'src/entity/role.entity';
import { PostCategoryService } from './post-category.service';

@Module({
  imports: [TypeOrmModule.forFeature([Roles, Categories, PostCategory])],
  providers: [PostCategoryService],
  exports: [PostCategoryService],
})
export class PostCategoryModule {}
