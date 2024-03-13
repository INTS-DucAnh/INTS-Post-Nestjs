import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { UpdateCategoryDto } from './dto/category-update.dto';
import { UserInRequest } from 'src/config/req-res.config';
import { FormCreateCategoryDto } from './dto/category-create.dto';
import { UserServices } from '../user/user.service';
import { PermissionService } from '../permission/permission.service';
import { ResponseInterceptor } from 'src/interceptor/response.interceptor';
import { AccessTokenGuard } from 'src/guard/jwt/accesstoken.guard';

@UseInterceptors(new ResponseInterceptor())
@Controller('/category')
export class CategoryController {
  constructor(
    private readonly categoryService: CategoryService,
    private readonly userService: UserServices,
    private readonly permissionService: PermissionService,
  ) {}

  @Get('/')
  getCategory(@Query('skip') skip: number, @Query('limit') limit: number = 10) {
    return this.categoryService.findCategory(skip, limit);
  }

  @UseGuards(AccessTokenGuard)
  @Put('/')
  async updateCategory(
    @Body() updateCategory: UpdateCategoryDto,
    @Req() req: UserInRequest,
  ) {
    const validCate = await this.categoryService.isValidCategory(
      updateCategory.id,
    );

    if (validCate.createby === req.user.id || req.user.isAdmin) {
      const [updateby, updateat] = [req.user.id, new Date()];
      return this.categoryService.updateCategory({
        ...validCate,
        ...updateCategory,
        updateby: updateby,
        updateat: updateat,
      });
    } else
      throw new ForbiddenException("You don't have permission to do this!");
  }

  @UseGuards(AccessTokenGuard)
  @Post('/')
  async createCategory(
    @Body() createCategory: FormCreateCategoryDto,
    @Req() req: UserInRequest,
  ) {
    const valid = await this.userService.checkValidUser(req.user.id);

    const createDate = new Date();

    return this.categoryService.createCategory({
      ...createCategory,
      createat: createDate,
      updateat: createDate,
      updateby: req.user.id,
      createby: req.user.id,
    });
  }

  @UseGuards(AccessTokenGuard)
  @Delete('/:id')
  async deleteCategory(@Param('id') cid: number, @Req() req: UserInRequest) {
    const validCate = await this.categoryService.isValidCategory(cid);

    if (validCate.createby === req.user.id || req.user.isAdmin) {
      return this.categoryService.deleteCategory(cid);
    } else
      throw new ForbiddenException("You don't have permission to do this!");
  }
}
