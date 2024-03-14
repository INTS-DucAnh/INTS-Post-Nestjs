import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetPermisionsDto } from './dto/permission-get.dto';
import { Users } from 'src/entity/user.entity';
import { Roles } from 'src/entity/role.entity';
import { RolesIdEnum } from 'src/guard/permission/roles.enum';
import { RoleTitleEnum } from './enum/permisison.enum';
@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
  ) {}

  async checkRole(userid: number) {
    const getRole = await this.userRepository
      .createQueryBuilder('users')
      .innerJoinAndSelect('users.roles', 'roles')
      .where('users.id = :uid', {
        uid: userid,
      })
      .getOne();
    const userRole: Roles = JSON.parse(JSON.stringify(getRole.roles));
    return {
      isAdmin: userRole.id === RolesIdEnum.ADMIN && userRole.active,
      roleid: userRole.id,
    };
  }
}
