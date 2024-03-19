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
import { FileUtils } from '../post/util/file.utils';
import { ConfigService } from '@nestjs/config';
import { S3Utils } from '../post/util/s3.util';
import { FileInterceptor } from '@nestjs/platform-express';
import { Roles } from 'src/guard/permission/permission.decorator';
import { RoleTitleEnum } from '../permission/enum/permisison.enum';
import { PermissionGuard } from 'src/guard/permission/permission.guard';

@UseInterceptors(new ResponseInterceptor())
@Controller('/user')
export class UserController {
  constructor(
    private readonly userService: UserServices,
    private readonly configService: ConfigService,
  ) {}

  @Roles([RoleTitleEnum.ADMIN, RoleTitleEnum.EDITOR])
  @UseGuards(AccessTokenGuard, PermissionGuard)
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

    const uploadImage = await S3Utils.uploadImageToS3(
      [
        {
          filename: this.configService
            .get<string>('S3_BUCKET_USER')
            .replaceAll(':userid', req.user.id.toString())
            .replace(':filetype', 'png'),
          image: image,
        },
      ],
      this.configService.get<string>('S3_BUCKET_NAME'),
    );

    const { password, username, ...props } = await this.userService.updateUser({
      ...existUsers,
      avatar: uploadImage[0].Location,
    });

    return props;
  }

  @Roles([RoleTitleEnum.ADMIN, RoleTitleEnum.EDITOR])
  @UseGuards(AccessTokenGuard, PermissionGuard)
  @Put('/pass')
  async changePasswordUser(
    @Body() changePassword: ChangPasswordDto,
    @Query('id') id: number,
    @Req() req: UserInRequest,
  ) {
    if (!req.user.isAdmin && req.user.id !== id)
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

  @Roles([RoleTitleEnum.ADMIN, RoleTitleEnum.EDITOR])
  @UseGuards(AccessTokenGuard, PermissionGuard)
  @Put('/:id')
  async updateUserProfile(
    @Body() updateProfile: UpdateUserDto,
    @Param('id') id: number,
    @Req() req: UserInRequest,
  ) {
    if (req.user.id !== id && !req.user.isAdmin)
      throw new BadRequestException("You don't own this account");
    if (!req.user.isAdmin && updateProfile.roleid === RoleTitleEnum.ADMIN)
      throw new BadRequestException('Can not update from user to admin!');

    const existUsers = await this.userService.checkValidUser(id);
    let updateInfo = updateProfile;
    if (updateInfo.password)
      updateInfo.password = await argon2.hash(updateInfo.password);
    else delete updateInfo.password;
    delete existUsers.roles;
    const updateUser = await this.userService.updateUser({
      ...existUsers,
      ...updateInfo,
    });

    const { password, ...props } = updateUser;
    return props;
  }

  @Roles([RoleTitleEnum.ADMIN])
  @UseGuards(AccessTokenGuard, PermissionGuard)
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

  @Roles([RoleTitleEnum.ADMIN, RoleTitleEnum.EDITOR])
  @UseGuards(AccessTokenGuard, PermissionGuard)
  @Get('/find')
  async findUser(@Query('skip') skip: number, @Query('limit') limit: number) {
    return this.userService.findUserByFilter(skip, limit);
  }

  @Roles([RoleTitleEnum.ADMIN, RoleTitleEnum.EDITOR])
  @UseGuards(AccessTokenGuard, PermissionGuard)
  @Get('/')
  async getMyProfile(@Req() req: UserInRequest) {
    const existUser = await this.userService.checkValidUser(req.user.id);

    const { password, username, ...props } = existUser;
    return props;
  }

  @Roles([RoleTitleEnum.ADMIN, RoleTitleEnum.EDITOR])
  @UseGuards(AccessTokenGuard, PermissionGuard)
  @Get('/:id')
  async getUserProfile(@Param('id') id: number) {
    const existUser = await this.userService.checkValidUser(id);

    const { password, ...props } = existUser;
    return props;
  }

  @Roles([RoleTitleEnum.ADMIN])
  @UseGuards(AccessTokenGuard, PermissionGuard)
  @Delete('/:id')
  async deleteUser(@Param('id') id: number, @Req() req: UserInRequest) {
    if (req.user.id === id)
      throw new BadRequestException('Can not delete your account!');
    const existUser = await this.userService.checkValidUser(id);

    const deleteUser = await this.userService.deleteUser(id);
    return deleteUser;
  }
}
