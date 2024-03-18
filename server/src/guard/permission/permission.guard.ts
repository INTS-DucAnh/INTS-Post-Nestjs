import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoleTitleEnum } from 'src/apps/permission/enum/permisison.enum';
import { PermissionService } from 'src/apps/permission/permission.service';
import { Roles } from './permission.decorator';
@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private permissionService: PermissionService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredActions = this.reflector.get<RoleTitleEnum[]>(
      Roles,
      context.getHandler(),
    );

    if (!requiredActions) {
      return true; // If route doesn't require any permission, allow access
    }

    const request = context.switchToHttp().getRequest();
    // const userId = request.user.id;
    const { isAdmin, roleid } = await this.permissionService.checkRole(
      request.user.id,
    );
    request.user.isAdmin = isAdmin;
    return requiredActions.includes(roleid);
  }
}
