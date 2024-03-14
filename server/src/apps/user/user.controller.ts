import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Put,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserServices } from './user.service';
import * as argon2 from 'argon2';
import { ChangPasswordDto, UpdateUserDto } from './dto/user-update.dto';
import { UserInRequest } from 'src/config/req-res.config';
import { AccessTokenGuard } from 'src/guard/jwt/accesstoken.guard';
import { ResponseInterceptor } from 'src/interceptor/response.interceptor';
import { UserDto } from './dto/user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { PostImageService } from '../post-image/post-image.service';
import { FileUtils } from '../post/util/file.utils';
import { ConfigService } from '@nestjs/config';
import { PermissionGuard } from 'src/guard/permission/permission.guard';

@UseInterceptors(new ResponseInterceptor())
@Controller('/user')
export class UserController {
  constructor(
    private readonly userService: UserServices,
    private readonly postImageServer: PostImageService,
    private readonly configService: ConfigService,
  ) {}

  @UseGuards(AccessTokenGuard)
  @Put('/:id')
  async updateUserProfile(
    @Body() updateProfile: UpdateUserDto,
    @Param('id') id: number,
    @Req() req: UserInRequest,
  ) {
    if (req.user.id !== id)
      throw new BadRequestException("You don't own this account");
    const existUsers = await this.userService.checkValidUser(id);

    const updateUser = await this.userService.updateUser({
      ...existUsers,
      ...updateProfile,
    });

    const { password, ...props } = updateUser;
    return props;
  }

  @UseGuards(AccessTokenGuard)
  @Put('/restore/:id')
  async restoreUser(@Param('id') id: number, @Req() req: UserInRequest) {
    if (!req.user.isAdmin)
      throw new BadRequestException("You don't own this account");
    const existUsers = await this.userService.checkValidUser(id, true);

    const updateUser = await this.userService.updateUser({
      ...existUsers,
      deletedat: null,
    });

    const { password, ...props } = updateUser;
    return props;
  }

  @UseGuards(AccessTokenGuard)
  @Put('/pass')
  async changePasswordUser(
    @Body() changePassword: ChangPasswordDto,
    @Query('id') id: string,
    @Req() req: UserInRequest,
  ) {
    if (req.user.id !== parseInt(id))
      throw new BadRequestException("You don't own this account");
    const existUsers = await this.userService.checkValidUser(id);

    if (changePassword.newPassword && changePassword.oldPassword) {
      if (
        await argon2.verify(existUsers.password, changePassword.oldPassword)
      ) {
        if (changePassword.newPassword !== changePassword.oldPassword) {
          const change = this.userService.updateUser({
            ...existUsers,
            password: await argon2.hash(changePassword.newPassword),
          });
        } else
          throw new BadRequestException(
            'New password and current password is duplicated!',
          );
      } else throw new BadRequestException('Current password is not match!');
    } else throw new BadRequestException('Invalid request body!');

    return { message: 'Succesfully update password!' };
  }

  @UseGuards(AccessTokenGuard)
  @UseInterceptors(FileInterceptor('image'))
  @Put('/avatar')
  async uploadAvatar(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: FileUtils.CalSizeFile('10 mb') }),
          new FileTypeValidator({ fileType: /(jpg|jpeg|png)$/ }),
        ],
      }),
    )
    image: Express.Multer.File,
    @Req() req: UserInRequest,
  ) {
    const existUsers = await this.userService.checkValidUser(req.user.id);

    const uploadImage = await this.postImageServer.uploadImageToS3([
      {
        filename: `${this.configService.get<string>('S3_BUCKET_USER')}/${req.user.id}/${req.user.id}-avatar.png`,
        image: image,
      },
    ]);

    const { password, username, ...props } = await this.userService.updateUser({
      ...existUsers,
      avatar: uploadImage[0].Location,
    });

    return props;
  }

  @UseGuards(AccessTokenGuard)
  @Get('/:id')
  async getUserProfile(@Param('id') id: number) {
    const existUser = await this.userService.checkValidUser(id);

    const { password, username, ...props } = existUser;
    return props;
  }

  @UseGuards(AccessTokenGuard)
  @Delete('/:id')
  async deleteUser(@Param('id') id: number, @Req() req: UserInRequest) {
    if (req.user.id !== id)
      throw new BadRequestException("You don't own this account");

    const existUser = await this.userService.checkValidUser(id);

    const deleteUser = await this.userService.deleteUser(id);
    return deleteUser;
  }
}
