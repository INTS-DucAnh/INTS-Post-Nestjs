import { Controller, Get, UseGuards, UseInterceptors } from '@nestjs/common';
import { RoleService } from './roles.service';
import { ResponseInterceptor } from 'src/interceptor/response.interceptor';
import { Roles } from 'src/guard/permission/permission.decorator';
import { RoleTitleEnum } from '../permission/enum/permisison.enum';
import { AccessTokenGuard } from 'src/guard/jwt/accesstoken.guard';
import { PermissionGuard } from 'src/guard/permission/permission.guard';

@UseInterceptors(new ResponseInterceptor())
@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Roles([RoleTitleEnum.ADMIN, RoleTitleEnum.EDITOR])
  @UseGuards(AccessTokenGuard, PermissionGuard)
  @Get('/')
  getRoles() {
    return this.roleService.getListRole();
  }
}
