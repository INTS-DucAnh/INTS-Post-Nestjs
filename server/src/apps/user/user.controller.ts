import { Controller, Delete, Get, Patch } from '@nestjs/common';
import { UserServices } from './user.service';

@Controller('/user')
export class UserController {
  constructor(private readonly userService: UserServices) {}

  @Patch('/:id')
  async updateUserProfile() {}

  @Get('/:id')
  async getUserProfile() {}

  @Delete('/:id')
  async deleteUser() {}
}
