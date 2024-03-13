import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PostService } from './post.service';
import { UserServices } from '../user/user.service';
import { ResponseInterceptor } from 'src/interceptor/response.interceptor';
import { CreatePostDto, FormPostDto } from './dto/post-create.dto';
import { UpdateFormPostDto, UpdatePostDto } from './dto/post-update.dto';
import { UserInRequest } from 'src/config/req-res.config';
import { ViewPostDto } from './dto/post-view.dto';
import { AccessTokenGuard } from 'src/guard/jwt/accesstoken.guard';
import { PermissionGuard } from 'src/guard/permission/permission.guard';
import { Actions } from 'src/guard/permission/permission.decorator';
import { PostCategoryService } from '../post-category/post-category.service';
import { PostImageService } from '../post-image/post-image.service';

@UseInterceptors(new ResponseInterceptor())
@Controller('/post')
export class PostController {
  constructor(
    private readonly postService: PostService,
    private readonly userService: UserServices,
    private readonly postCategoryService: PostCategoryService,
    private readonly postImageService: PostImageService,
  ) {}

  @UseGuards(AccessTokenGuard)
  @Get('/user')
  async getUserPost(
    @Req() req: UserInRequest,
    @Query('skip') skip: number,
    @Query('limit') limit: number,
  ) {
    const existUser = await this.userService.checkValidUser(req.user.id);

    const getUserPosts = await this.postService.getPostsUser(
      existUser.id,
      skip,
      limit,
    );

    return getUserPosts;
  }

  @UseGuards(AccessTokenGuard)
  @Post('/create')
  async createUserPost(
    @Body() formPost: FormPostDto,
    @Req() req: UserInRequest,
  ) {
    const existUser = await this.userService.findUserById(req.user.id);
    if (!existUser) throw new BadRequestException('User is not exist!');
    const createP = await this.postService.createPost({
      ...formPost,
      createby: req.user.id,
      updateby: req.user.id,
    });

    return this.postService.getPostById(createP.id);
  }

  @UseGuards(AccessTokenGuard)
  @Patch('/update')
  async updateUsePost(
    @Body() updatePost: UpdateFormPostDto,
    @Req() req: UserInRequest,
  ) {
    const existUser = await this.userService.findUserById(req.user.id);
    if (!existUser) throw new BadRequestException('User is not exist!');

    const getPost: ViewPostDto = await this.postService.getPostById(
      updatePost.id,
    );
    if (!getPost) throw new BadRequestException('This post is not exist!');
    else if (req.user.roleid !== 1 && getPost.createby !== req.user.id)
      throw new ForbiddenException('You dont have permission to do this!');

    const { images, categories, ...props } = updatePost;

    const updateP = await this.postService.updatePost({
      ...getPost,
      ...props,
      updateby: req.user.id,
    });

    return updateP;
  }

  @UseGuards(AccessTokenGuard)
  @Delete('/delete')
  async deleteUserPost(@Query('pid') pid: number, @Req() req: UserInRequest) {
    const existUser = await this.userService.findUserById(req.user.id);
    if (!existUser) throw new BadRequestException('User is not exist!');

    const getPost: ViewPostDto = await this.postService.getPostById(pid);
    if (!getPost) throw new BadRequestException('This post is not exist!');
    else if (req.user.roleid !== 1 && getPost.createby !== req.user.id)
      throw new ForbiddenException('You dont have permission to do this!');

    const deleteUserPost = await this.postService.deletePost(getPost);
    return deleteUserPost;
  }
}
