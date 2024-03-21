import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Posts } from 'src/entity/post.entity';
import { In, Repository } from 'typeorm';
import { UpdatePostDto } from './dto/post-update.dto';
import { jwtPayload } from '../auth/strategies/accesstoken.strategies';
import { PostCategory } from 'src/entity/post-category.entity';
import { PostCategoryDto } from './dto/post-category.dto';
import { ConfigService } from '@nestjs/config';
import { S3Utils } from './util/s3.util';
import { FormPostDto } from './dto/post-create.dto';
import { ImagesToS3 } from './dto/post-image.dto';
import { MESSAGE_CONSTANT, S3_CONSTANT } from 'src/config/app.constant';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Posts) private readonly postRepository: Repository<Posts>,
    @InjectRepository(PostCategory)
    readonly postCategoryRepository: Repository<PostCategory>,
    private readonly configService: ConfigService,
  ) {}

  async attachCategoryToPosts(cid: number[], postid: number, userid: number) {
    const deleteCategory = await this.postCategoryRepository
      .createQueryBuilder()
      .delete()
      .from('post-category')
      .where('poid = :postid', { postid })
      .execute();

    const posts: PostCategoryDto[] = cid.map((id: number) => ({
      poid: postid,
      cid: id,
    }));
    return await this.updateCategoryPost(posts);
  }

  async updateCategoryPost(updatePostCategory: PostCategoryDto[]) {
    return this.postCategoryRepository.save(updatePostCategory);
  }

  async uploadImage(file: ImagesToS3) {
    const uploaded = await S3Utils.uploadImageToS3(
      [file],
      this.configService.get<string>(S3_CONSTANT.bucket.name),
    );
    return {
      url: uploaded[0].Location,
    };
  }

  async deleteImage(filename: string) {
    const deleted = await S3Utils.deleteImageFromS3(
      [filename],
      this.configService.get<string>(S3_CONSTANT.bucket.name),
    );
    return deleted;
  }

  async findPost(skip: number, limit: number) {
    const query = this.postRepository
      .createQueryBuilder('posts')
      .withDeleted()
      .leftJoinAndSelect('posts.usersUpdate', 'userUpdate')
      .withDeleted()
      .leftJoinAndSelect('posts.usersCreate', 'userCreate')
      .leftJoinAndSelect('posts.categories', 'categories')
      .select([
        'posts.id',
        'posts.content',
        'posts.thumbnail',
        'posts.createat',
        'posts.updateat',
        'categories.id',
        'categories.title',
        'userCreate.avatar',
        'userCreate.firstname',
        'userCreate.lastname',
        'userCreate.username',
        'userUpdate.avatar',
        'userUpdate.firstname',
        'userUpdate.lastname',
        'userUpdate.username',
      ])
      .where('posts.deletedat IS NULL');

    const [maxPage, findRes] = await Promise.all([
      query.getCount(),
      query.skip(skip).take(limit).orderBy('posts.id', 'ASC').getMany(),
    ]);

    return {
      posts: findRes,
      max: maxPage,
    };
  }

  async getPostById(pid: number) {
    return this.postRepository
      .createQueryBuilder('posts')
      .leftJoinAndSelect('posts.categories', 'categories')
      .select([
        'posts.id',
        'posts.thumbnail',
        'posts.content',
        'posts.title',
        'posts.updateat',
        'posts.createat',
        'posts.createby',
        'categories.id',
        'categories.title',
      ])
      .where('posts.id = :id', { id: pid })
      .getOne();
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
    if (!user.isAdmin && user.id !== getPost.createby)
      throw new ForbiddenException(MESSAGE_CONSTANT.permission.notOwn('post'));

    const { categories, ...data } = updatePost;
    const newPost = await this.postRepository.save({
      ...getPost,
      ...data,
      updateby: user.id,
    });
    try {
      const attachCate = await this.attachCategoryToPosts(
        categories,
        newPost.id,
        user.id,
      );
    } catch (err) {
      throw new BadRequestException(
        MESSAGE_CONSTANT.targetNonExist('category'),
      );
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
