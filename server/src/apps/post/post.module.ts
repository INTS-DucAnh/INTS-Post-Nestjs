import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Posts } from 'src/entity/post.entity';
import { PermissionModule } from '../permission/permission.module';
import { PostCategoryModule } from '../post-category/post-category.module';
import { PostImageModule } from '../post-image/post-image.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Posts]),
    UserModule,
    PermissionModule,
    PostCategoryModule,
    PostImageModule,
  ],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
