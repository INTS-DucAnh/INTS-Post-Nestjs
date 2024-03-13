import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RolePermission } from 'src/entity/role-permission.entity';
import { Permissions } from 'src/entity/permission.entity';
import { GetPermisionsDto } from './dto/permission-get.dto';
import { Users } from 'src/entity/user.entity';
import { Roles } from 'src/entity/role.entity';
import { RolesIdEnum } from 'src/guard/permission/roles.enum';
@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
    @InjectRepository(Permissions)
    private readonly permissionRepository: Repository<Permissions>,
    @InjectRepository(Roles)
    private readonly roleRepository: Repository<Roles>,
  ) {}

  async isAdmin(userid: number): Promise<boolean> {
    const getRole = await this.userRepository
      .createQueryBuilder('users')
      .innerJoinAndSelect('users.roles', 'roles')
      .where('users.id = :uid', {
        uid: userid,
      })
      .getOne();
    const userRole: Roles = JSON.parse(JSON.stringify(getRole.roles));
    return userRole.id === RolesIdEnum.ADMIN && userRole.active;
  }

  async validAction(
    userid: number,
    actions: Array<{ target: string; action: string[] }> | [],
  ) {
    const userRoleid = (await this.userRepository.findOneBy({ id: userid })).id;

    const permissionOfRole = await this.permissionRepository
      .createQueryBuilder('permissions')
      .leftJoin('permissions.roles', 'roles')
      .where('roles.id = :rid', { rid: userRoleid })
      .getMany();

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
