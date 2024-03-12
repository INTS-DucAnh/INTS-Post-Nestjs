import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { PermissionService } from 'src/apps/permission/permission.service';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private permissionService: PermissionService,
  ) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredActions = this.reflector.get<
      Array<{ target: string; action: string[] }>
    >('actions', context.getHandler());
    if (!requiredActions) {
      return true; // If route doesn't require any permission, allow access
    }

    const request = context.switchToHttp().getRequest();
    const userId = request.user.id;

    return this.permissionService.validAction(2, requiredActions);
  }
}
