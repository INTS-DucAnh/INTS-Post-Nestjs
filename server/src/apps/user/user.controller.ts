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
import { ConfigService } from '@nestjs/config';
import { Roles } from 'src/guard/permission/permission.decorator';
import { RoleTitleEnum } from '../permission/enum/permisison.enum';
import { PermissionGuard } from 'src/guard/permission/permission.guard';
import { MESSAGE_CONSTANT } from 'src/config/app.constant';

@UseInterceptors(new ResponseInterceptor())
@Controller('/user')
export class UserController {
  constructor(
    private readonly userService: UserServices,
    private readonly configService: ConfigService,
  ) {}

  @Roles([RoleTitleEnum.ADMIN, RoleTitleEnum.EDITOR])
  @UseGuards(AccessTokenGuard, PermissionGuard)
  @Put('/pass')
  async changePasswordUser(
    @Body() changePassword: ChangPasswordDto,
    @Query('id') id: number,
    @Req() req: UserInRequest,
  ) {
    this.userService.isOwnAccount(!req.user.isAdmin && req.user.id !== id);

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
    } else
      throw new BadRequestException(
        MESSAGE_CONSTANT.param.invalid('request-body'),
      );

    return { message: MESSAGE_CONSTANT.user.success.update };
  }

  @Roles([RoleTitleEnum.ADMIN, RoleTitleEnum.EDITOR])
  @UseGuards(AccessTokenGuard, PermissionGuard)
  @Put('/:id')
  async updateUserProfile(
    @Body() updateProfile: UpdateUserDto,
    @Param('id') id: number,
    @Req() req: UserInRequest,
  ) {
    this.userService.isOwnAccount(req.user.id !== id && !req.user.isAdmin);

    if (!req.user.isAdmin && updateProfile.roleid === RoleTitleEnum.ADMIN)
      throw new BadRequestException(MESSAGE_CONSTANT.permission.notAllow);

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
    this.userService.isOwnAccount(!req.user.isAdmin);

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

    const { password, ...props } = existUser;
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
      throw new BadRequestException(
        MESSAGE_CONSTANT.user.badrequest.delete.self,
      );
    const existUser = await this.userService.checkValidUser(id);

    const deleteUser = await this.userService.deleteUser(id);
    return deleteUser;
  }
}
