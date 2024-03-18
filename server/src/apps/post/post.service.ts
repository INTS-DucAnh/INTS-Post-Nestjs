import {
  BadGatewayException,
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Posts } from 'src/entity/post.entity';
import { In, Repository } from 'typeorm';
import { UpdatePostDto } from './dto/post-update.dto';
import { ViewPostDto } from './dto/post-view.dto';
import { jwtPayload } from '../auth/strategies/accesstoken.strategies';
import { PostCategory } from 'src/entity/post-category.entity';
import { PostCategoryDto } from './dto/post-category.dto';
import { ConfigService } from '@nestjs/config';
import { S3Utils } from './util/s3.util';
import { FormPostDto } from './dto/post-create.dto';
import { ImagesToS3 } from './dto/post-image.dto';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Posts) private readonly postRepository: Repository<Posts>,
    @InjectRepository(PostCategory)
    readonly postCategoryRepository: Repository<PostCategory>,
    private readonly configService: ConfigService,
  ) {}

  async getPostCategoryById(pid: number) {
    return this.postCategoryRepository.findBy({ poid: pid });
  }

  async attachCategoryToPosts(cid: number[], postid: number, userid: number) {
    const deleteCategory = await this.postCategoryRepository.query(
      `DELETE FROM "post-category" WHERE "poid" = $1`,
      [postid],
    );

    const updateDate = new Date();
    const posts: PostCategoryDto[] = cid.map((id: number) => ({
      poid: postid,
      cid: id,
      updateby: userid,
      updateat: updateDate,
    }));
    return await this.updateCategoryPost(posts);
  }

  async updateCategoryPost(updatePostCategory: PostCategoryDto[]) {
    return this.postCategoryRepository.save(updatePostCategory);
  }

  async uploadImage(file: ImagesToS3) {
    const uploaded = await S3Utils.uploadImageToS3(
      [file],
      this.configService.get<string>('S3_BUCKET_NAME'),
    );
    return {
      url: uploaded[0].Location,
    };
  }

  async deleteImage(filename: string) {
    const deleted = await S3Utils.deleteImageFromS3(
      [filename],
      this.configService.get<string>('S3_BUCKET_NAME'),
    );
    return deleted;
  }

  async findPost(skip: number, limit: number) {
    const query = this.postRepository.createQueryBuilder('posts');

    const [maxPage, findRes] = await Promise.all([
      query.getCount(),
      query.skip(skip).limit(limit).getMany(),
    ]);
    return {
      posts: findRes,
      max: Math.ceil(maxPage / 10),
    };
  }

  async getPostById(pid: number) {
    return this.postRepository.findOneBy({ id: pid });
  }

  async getPostsUser(userid: number, skip: number = 0, limit: number = 10) {
    const [userPost, maxPage] = await Promise.all([
      this.postRepository
        .createQueryBuilder('posts')
        .innerJoin('posts.usersCreate', 'users')
        .where('users.id = :uid', { uid: userid })
        .skip(skip)
        .limit(limit)
        .getMany(),
      this.postRepository
        .createQueryBuilder('posts')
        .innerJoin('posts.usersCreate', 'users')
        .where('users.id = :uid', { uid: userid })
        .getCount(),
    ]);
    return {
      posts: userPost,
      maxPage,
    };
  }

  async createPost(user: jwtPayload, createPost: FormPostDto) {
    const createDate = new Date();
    const { categories, ...data } = createPost;
    const newPost = await this.postRepository.save({
      ...data,
      createby: user.id,
      updateby: user.id,
    });
    const attachCate = await this.attachCategoryToPosts(
      categories,
      newPost.id,
      user.id,
    );
    return {
      post: newPost,
      category: categories,
    };
  }

  async updatePost(user: jwtPayload, updatePost: UpdatePostDto) {
    const getPost = await this.getPostById(updatePost.id);
    if (!user.isAdmin || !(user.id !== getPost.createby))
      throw new ForbiddenException('You are not owned this post!');

    const { categories, ...data } = updatePost;
    const newPost = await this.postRepository.save({
      ...getPost,
      ...data,
      createby: user.id,
      updateby: user.id,
    });
    try {
      const attachCate = await this.attachCategoryToPosts(
        categories,
        newPost.id,
        user.id,
      );
    } catch (err) {
      throw new BadRequestException('Not exist category!');
    }
    return {
      post: newPost,
      category: categories,
    };
  }
  async deletePost(ids: string[]) {
    return this.postRepository.softDelete({ id: In(ids) });
  }
}
