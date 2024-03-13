import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
  Req,
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

@UseInterceptors(new ResponseInterceptor())
@Controller('/user')
export class UserController {
  constructor(private readonly userService: UserServices) {}

  @UseGuards(AccessTokenGuard)
  @Patch('/update')
  async updateUserProfile(
    @Body() updateProfile: UpdateUserDto,
    @Query('id') id: string,
    @Req() req: UserInRequest,
  ) {
    if (req.user.id !== parseInt(id))
      throw new BadRequestException("You don't own this account");
    const existUsers = await this.userService.checkValidUser(id);

    const updateUser = await this.userService.updateUser({
      ...existUsers,
      ...updateProfile,
    });

    const { password, ...props } = existUsers;
    return props;
  }

  @UseGuards(AccessTokenGuard)
  @Patch('/change-pass')
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

  @Get('/:id')
  async getUserProfile(@Param('id') id: string) {
    const existUser = await this.userService.checkValidUser(id);

    const { password, ...props } = existUser;
    return props;
  }

  @Delete('/:id')
  async deleteUser(@Param('id') id: string) {
    const existUser = await this.userService.checkValidUser(id);

    return false;
  }
}
