import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostCategory } from 'src/entity/post-category.entity';
import { Repository } from 'typeorm';
import { PostCategoryDto } from './dto/post-category.dto';

@Injectable()
export class PostCategoryService {
  constructor(
    @InjectRepository(PostCategory)
    private readonly postCategoryRepository: Repository<PostCategory>,
  ) {}

  async getPostById(pid: number) {
    return this.postCategoryRepository.findBy({ poid: pid });
  }

  async attachCategoryToPosts(cid: number[], postid: number, userid: number) {
    let posts: PostCategoryDto[] = await this.getPostById(postid);

    const deleteCategory = await this.postCategoryRepository.query(
      `DELETE FROM post-category WHERE "poid" = $1`,
      [postid],
    );

    const updateDate = new Date();
    posts = cid.map((id: number) => ({
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
}
