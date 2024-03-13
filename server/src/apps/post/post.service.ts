import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Posts } from 'src/entity/post.entity';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/post-create.dto';
import { UpdatePostDto } from './dto/post-update.dto';
import { ViewPostDto } from './dto/post-view.dto';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Posts) private readonly postRepository: Repository<Posts>,
  ) {}

  async findPost(skip: number, limit: number) {
    const query = this.postRepository.createQueryBuilder('posts');

    const [maxPage, findRes] = await Promise.all([
      query.getCount(),
      query.skip(skip).limit(limit).getMany(),
    ]);
    return {
      posts: findRes,
      max: maxPage,
    };
  }

  async getPostById(pid: number) {
    return this.postRepository.findOneBy({ id: pid });
  }

  async getPostsUser(userid: number, skip: number, limit: number = 10) {
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

  async createPost(createPost: CreatePostDto) {
    const update = await this.postRepository.save(createPost);

    return update;
  }

  async updatePost(
    updatePost: ViewPostDto,
    images: string[],
    categories: number[],
  ) {
    return this.postRepository.save(updatePost);
  }

  async deletePost(deletePost: ViewPostDto) {
    return this.postRepository.softDelete(deletePost);
  }
}
