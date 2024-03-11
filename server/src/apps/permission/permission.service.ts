import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RolePermission } from 'src/entity/role-permission.entity';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(RolePermission)
    private readonly permissionRepository: Repository<RolePermission>,
  ) {}

  async validAction(
    roleid: number,
    actions: Array<{ target: string; action: string[] }> | [],
  ) {
    const permissionOfRole = await this.permissionRepository
      .createQueryBuilder('permissions')
      .leftJoinAndSelect('permissions.roles', 'roles')
      .where('roles.id = :rid', { rid: roleid })
      .getMany();

    let mapPermission = JSON.parse(JSON.stringify(permissionOfRole));
    mapPermission = mapPermission.reduce((prev, curr) => {
      return {
        ...prev,
        [curr.target]: [...(prev[curr.target] || []), curr.action],
      };
    }, {});

    for (let action of actions) {
      if (!mapPermission[action.target]) {
        return false;
      } else {
        for (let act of action.action) {
          if (!mapPermission[action.target].includes(act)) {
            return false;
          }
        }
      }
    }

    return true;
  }
}
