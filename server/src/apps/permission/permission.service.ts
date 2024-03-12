import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RolePermission } from 'src/entity/role-permission.entity';
import { Permissions } from 'src/entity/permission.entity';
import { Roles } from 'src/entity/role.entity';
import { GetPermisionsDto } from './dto/permission-get.dto';
import { RoleEnum } from './enum/permisison.enum';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Permissions)
    private readonly permissionRepository: Repository<Permissions>,
    @InjectRepository(Roles)
    private readonly roleRepository: Repository<Roles>,
  ) {}

  async isAdmin(roleid: number): Promise<boolean> {
    const getPermissionById = await this.roleRepository
      .createQueryBuilder('roles')
      .leftJoin('roles.permissions', 'permissions')
      .where('roles.id = :rid', { rid: roleid })
      .getOne();

    return (
      getPermissionById.title === RoleEnum.ADMIN && getPermissionById.active
    );
  }

  async validAction(
    roleid: number,
    actions: Array<{ target: string; action: string[] }> | [],
  ) {
    const permissionOfRole = await this.permissionRepository
      .createQueryBuilder('permissions')
      .leftJoin('permissions.roles', 'roles')
      .where('roles.id = :rid', { rid: roleid })
      .getMany();

    console.log(permissionOfRole);

    let mapPermission = JSON.parse(JSON.stringify(permissionOfRole));
    mapPermission = mapPermission.reduce(
      (prev: GetPermisionsDto[], curr: GetPermisionsDto) => {
        return {
          ...prev,
          [curr.target]: [...(prev[curr.target] || []), curr.action],
        };
      },
      {},
    );

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
