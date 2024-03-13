import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { PermissionService } from 'src/apps/permission/permission.service';
import { ActionsDto } from './actions.dto';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private permissionService: PermissionService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredActions = this.reflector.get<ActionsDto[]>(
      'actions',
      context.getHandler(),
    );
    if (!requiredActions) {
      return true; // If route doesn't require any permission, allow access
    }

    const request = context.switchToHttp().getRequest();
    // const userId = request.user.id;
    const [isAdmin, isValidAction] = await Promise.all([
      this.permissionService.isAdmin(request.user.id),
      this.permissionService.validAction(request.user.id, requiredActions),
    ]);

    request.user.isAdmin = isAdmin;

    return isAdmin || isValidAction;
  }
}
