import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  ForbiddenException,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseArrayPipe,
  ParseFilePipe,
  Post,
  Put,
  Query,
  Req,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PostService } from './post.service';
import { ResponseInterceptor } from 'src/interceptor/response.interceptor';
import { FormPostDto } from './dto/post-create.dto';
import { UpdatePostDto } from './dto/post-update.dto';
import { UserInRequest } from 'src/config/req-res.config';
import { AccessTokenGuard } from 'src/guard/jwt/accesstoken.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileUtils } from './util/file.utils';
import { PermissionGuard } from 'src/guard/permission/permission.guard';
import { Roles } from 'src/guard/permission/permission.decorator';
import { RoleTitleEnum } from '../permission/enum/permisison.enum';

@UseInterceptors(new ResponseInterceptor())
@Controller('/post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Roles([RoleTitleEnum.ADMIN, RoleTitleEnum.EDITOR])
  @UseGuards(AccessTokenGuard, PermissionGuard)
  @Get('/find')
  async findPost(
    @Req() req: UserInRequest,
    @Query('categories') categories: string,
    @Query('skip') skip: number,
    @Query('limit') limit: number,
  ) {
    return this.postService.findPost(skip, limit);
  }

  @Roles([RoleTitleEnum.ADMIN, RoleTitleEnum.EDITOR])
  @UseGuards(AccessTokenGuard, PermissionGuard)
  @Get('/user')
  getUserPost(
    @Query('id') id: number,
    @Query('skip') skip: number,
    @Query('limit') limit: number,
  ) {
    return this.postService.getPostsUser(id, skip, limit);
  }

  @Roles([RoleTitleEnum.ADMIN, RoleTitleEnum.EDITOR])
  @UseGuards(AccessTokenGuard, PermissionGuard)
  @Post('/')
  async createUserPost(
    @Body() formPost: FormPostDto,
    @Req() req: UserInRequest,
  ) {
    return this.postService.createPost(req.user, formPost);
  }

  @Roles([RoleTitleEnum.ADMIN, RoleTitleEnum.EDITOR])
  @UseGuards(AccessTokenGuard, PermissionGuard)
  @Put('/')
  async updateUsePost(
    @Body() updatePost: UpdatePostDto,
    @Req() req: UserInRequest,
  ) {
    const { categories, ...props } = updatePost;

    return this.postService.updatePost(req.user, updatePost);
  }

  @Roles([RoleTitleEnum.ADMIN, RoleTitleEnum.EDITOR])
  @UseGuards(AccessTokenGuard, PermissionGuard)
  @UseInterceptors(FileInterceptor('image'))
  @Post('/s3-upload')
  async upload(
    @Req() req: UserInRequest,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: FileUtils.CalSizeFile('20 mb') }),
          new FileTypeValidator({ fileType: /(jpg|jpeg|png)$/ }),
        ],
      }),
    )
    image: Express.Multer.File,
  ) {
    return this.postService.uploadImage({
      filename: '',
      image: image,
    });
  }

  @Roles([RoleTitleEnum.ADMIN, RoleTitleEnum.EDITOR])
  @UseGuards(AccessTokenGuard, PermissionGuard)
  @Delete('/s3-delete')
  async deleteImage(@Req() req: UserInRequest, @Query('file') file: string) {
    return this.postService.deleteImage(file);
  }

  @Roles([RoleTitleEnum.ADMIN])
  @UseGuards(AccessTokenGuard, PermissionGuard)
  @Delete('/')
  async deleteUserPost(
    @Query('id', new ParseArrayPipe({ items: String, separator: ',' }))
    pid: string[],
  ) {
    return this.postService.deletePost(pid);
  }
}
