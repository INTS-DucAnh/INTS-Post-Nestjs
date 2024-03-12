import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { UpdateCategoryDto } from './dto/category-update.dto';
import { UserInRequest } from 'src/config/req-res.config';
import { CreateCategoryDto } from './dto/category-create.dto';
import { UserServices } from '../user/user.service';
import { PermissionService } from '../permission/permission.service';

@Controller('/category')
export class CategoryController {
  constructor(
    private readonly categoryService: CategoryService,
    private readonly userService: UserServices,
    private readonly permissionService: PermissionService,
  ) {}

  @Get('/get')
  getCategory(@Query('skip') skip: number, @Query('limit') limit: number = 10) {
    return this.categoryService.findCategory(skip, limit);
  }

  @Patch('/update')
  async updateCategory(
    @Body() updateCategory: UpdateCategoryDto,
    @Req() req: UserInRequest,
  ) {
    const [validCate, _, isAdmin] = await Promise.all([
      this.categoryService.isValidCategory(updateCategory.id),
      this.userService.checkValidUser(req.user.id),
      this.permissionService.isAdmin(req.user.roleid),
    ]);

    if (validCate.createby === req.user.id || isAdmin) {
      const [updateby, updateat] = [req.user.id, new Date()];
      return this.categoryService.updateCategory({
        updateby,
        updateat,
        ...validCate,
        ...updateCategory,
      });
    } else
      throw new ForbiddenException("You don't have permission to do this!");
  }

  @Post('/create')
  async createCategory(
    @Body() createCategory: CreateCategoryDto,
    @Req() req: UserInRequest,
  ) {
    const valid = await this.userService.checkValidUser(req.user.id);

    return this.categoryService.createCategory(createCategory);
  }

  @Delete('/delete')
  async deleteCategory(@Query('cid') cid: number, @Req() req: UserInRequest) {
    const existCategory = await this.categoryService.isValidCategory(cid);
    if (existCategory.createby === req.user.id || req.user.roleid === 1) {
      return this.categoryService.deleteCategory(cid);
    } else
      throw new ForbiddenException("You don't have permission to do this!");
  }
}
