import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostImage } from 'src/entity/post-image.entity';
import { Repository } from 'typeorm';
import { InsertPostImageDto } from './dto/post-image-insert.dto';
import { ImagesToS3, PostImageDto } from './dto/post-image.dto';
import { S3 } from 'aws-sdk';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PostImageService {
  constructor(
    @InjectRepository(PostImage)
    private readonly postImageRepository: Repository<PostImage>,
    private readonly configService: ConfigService,
  ) {}

  async uploadImageToS3(images: ImagesToS3[]) {
    const s3 = new S3();
    const uploadPromises = images.map((image) => {
      const params = {
        Bucket: this.configService.get<string>('S3_BUCKET_NAME'),
        Key: image.filename,
        Body: image.image.buffer,
        ACL: 'public-read',
      };

      return s3.upload(params).promise();
    });
    try {
      const results = await Promise.all(uploadPromises);

      return results;
    } catch (error) {
      throw error;
    }
  }

  async getImagesByIds(id: number[]) {
    return this.postImageRepository
      .createQueryBuilder('post-image')
      .whereInIds(id)
      .getMany();
  }

  async insertImageUrl(insertImage: InsertPostImageDto[]) {
    return this.postImageRepository.save(insertImage);
  }

  async deleteImage(id: number) {
    return this.postImageRepository.delete({ id: id });
  }

  async updateImage(udpateImage: PostImageDto) {
    return this.postImageRepository.save(udpateImage);
  }
}
