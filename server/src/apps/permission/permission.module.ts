import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionService } from './permission.service';
import { Permissions } from 'src/entity/permission.entity';
import { Roles } from 'src/entity/role.entity';
import { Users } from 'src/entity/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Permissions, Roles, Users])],
  providers: [PermissionService],
  exports: [PermissionService],
})
export class PermissionModule {}
