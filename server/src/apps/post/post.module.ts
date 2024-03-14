import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Posts } from 'src/entity/post.entity';
import { PermissionModule } from '../permission/permission.module';
import { PostCategory } from 'src/entity/post-category.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Posts, PostCategory]),
    UserModule,
    PermissionModule,
  ],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
