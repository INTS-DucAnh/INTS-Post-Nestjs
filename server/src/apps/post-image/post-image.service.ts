import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostImage } from 'src/entity/post-image.entity';
import { Repository } from 'typeorm';
import { InsertPostImageDto } from './dto/post-image-insert.dto';
import { PostImageDto } from './dto/post-image.dto';

@Injectable()
export class PostImageService {
  constructor(
    @InjectRepository(PostImage)
    private readonly postImageRepository: Repository<PostImage>,
  ) {}

  async getImagesByIds(id: number[]) {
    return this.postImageRepository
      .createQueryBuilder('post-image')
      .whereInIds(id)
      .getMany();
  }

  async insertImageUrl(insertImage: InsertPostImageDto) {
    return this.postImageRepository.save(insertImage);
  }

  async deleteImage(id: number) {
    return this.postImageRepository.delete({ id: id });
  }

  async updateImage(udpateImage: PostImageDto) {
    return this.postImageRepository.save(udpateImage);
  }
}
