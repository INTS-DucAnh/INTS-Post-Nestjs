import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostImage } from 'src/entity/post-image.entity';
import { Posts } from 'src/entity/post.entity';
import { PostImageService } from './post-image.service';

@Module({
  imports: [TypeOrmModule.forFeature([PostImage, Posts])],
  providers: [PostImageService],
  exports: [PostImageService],
})
export class PostImageModule {}
