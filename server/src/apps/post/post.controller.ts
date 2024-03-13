import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  ForbiddenException,
  Get,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  Put,
  Query,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PostService } from './post.service';
import { ResponseInterceptor } from 'src/interceptor/response.interceptor';
import { FormPostDto, PostImageUploadDto } from './dto/post-create.dto';
import { UpdatePostDto } from './dto/post-update.dto';
import { UserInRequest } from 'src/config/req-res.config';
import { ViewPostDto } from './dto/post-view.dto';
import { AccessTokenGuard } from 'src/guard/jwt/accesstoken.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImagesToS3, PostImageDto } from '../post-image/dto/post-image.dto';
import { ConfigService } from '@nestjs/config';
import { PostImageService } from '../post-image/post-image.service';
import { ManagedUpload } from 'aws-sdk/clients/s3';
import { PostCategoryService } from '../post-category/post-category.service';
import { FileUtils } from './util/file.utils';

@UseInterceptors(new ResponseInterceptor())
@Controller('/post')
export class PostController {
  constructor(
    private readonly postService: PostService,
    private readonly postImageService: PostImageService,
    private readonly configService: ConfigService,
    private readonly postCategoryService: PostCategoryService,
  ) {}

  @Get('/find')
  async findPost(
    @Req() req: UserInRequest,
    @Query('categories') categories: string,
    @Query('skip') skip: number,
    @Query('limit') limit: number,
  ) {
    return this.postService.findPost(skip, limit);
  }

  @UseGuards(AccessTokenGuard)
  @Get('/user')
  getUserPost(
    @Query('id') id: number,
    @Query('skip') skip: number,
    @Query('limit') limit: number,
  ) {
    return this.postService.getPostsUser(id, skip, limit);
  }

  @UseGuards(AccessTokenGuard)
  @UseInterceptors(FileInterceptor('images'))
  @Post('/create')
  async createUserPost(
    @Body() formPost: FormPostDto,
    @Req() req: UserInRequest,
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: FileUtils.CalSizeFile('20 mb') }),
          new FileTypeValidator({ fileType: /(jpg|jpeg|png)$/ }),
        ],
      }),
    )
    images: PostImageUploadDto[],
  ) {
    const createDate = new Date();
    const createP = await this.postService.createPost({
      ...formPost,
      updateat: createDate,
      createby: req.user.id,
      updateby: req.user.id,
      createat: createDate,
    });

    const ImageMap: ImagesToS3[] = images.map(
      (img: PostImageUploadDto, idx: number) => {
        return {
          filename: `${this.configService.get<string>('S3_BUCKET_POST')}/${createP.id}/${createP.id}-${idx}-img.jpg`,
          image: img.image,
        };
      },
    );

    let haveDefault = false;
    const resultUrls = (
      await this.postImageService.uploadImageToS3(ImageMap)
    ).map((url: ManagedUpload.SendData, idx: number) => {
      if (!haveDefault) {
        haveDefault = images[idx].setdefault;
      }
      return {
        url: url.Location,
        updateat: createDate,
        createat: createDate,
        setdefault: !haveDefault,
        poid: createP.id,
        createby: req.user.id,
        updateby: req.user.id,
      };
    });

    const [insertImage, insertCategories] = await Promise.all([
      this.postImageService.insertImageUrl(resultUrls),
      this.postCategoryService.attachCategoryToPosts(
        formPost.categories,
        createP.id,
        req.user.id,
      ),
    ]);

    return {
      post: await this.postService.getPostById(createP.id),
      images: insertImage,
      categories: insertCategories,
    };
  }

  @UseGuards(AccessTokenGuard)
  @UseInterceptors(FileInterceptor('images'))
  @Put('/update')
  async updateUsePost(
    @Body() updatePost: UpdatePostDto,
    @Req() req: UserInRequest,
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: FileUtils.CalSizeFile('20 mb') }),
          new FileTypeValidator({ fileType: /(jpg|jpeg|png)$/ }),
        ],
      }),
    )
    imagesUpdate: PostImageUploadDto[],
  ) {
    const getPost: ViewPostDto = await this.postService.getPostById(
      updatePost.id,
    );
    if (!getPost) throw new BadRequestException('This post is not exist!');
    else if (!req.user.isAdmin || getPost.createby !== req.user.id)
      throw new ForbiddenException('You dont have permission to do this!');

    const { images, categories, ...props } = updatePost;

    const updateP = await this.postService.updatePost(
      {
        ...getPost,
        ...props,
        updateby: req.user.id,
        updateat: new Date(),
      },
      images,
      categories,
    );

    return updateP;
  }

  @UseGuards(AccessTokenGuard)
  @Delete('/delete')
  async deleteUserPost(@Query('pid') pid: number, @Req() req: UserInRequest) {
    const getPost: ViewPostDto = await this.postService.getPostById(pid);
    if (!getPost) throw new BadRequestException('This post is not exist!');
    else if (!req.user.isAdmin && !(getPost.createby === req.user.id))
      throw new ForbiddenException('You dont have permission to do this!');

    const deleteUserPost = await this.postService.deletePost(getPost);
    return deleteUserPost;
  }
}
