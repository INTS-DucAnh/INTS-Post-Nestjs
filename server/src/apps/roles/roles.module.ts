import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleService } from './roles.service';
import { Roles } from 'src/entity/role.entity';
import { RoleController } from './roles.controller';
import { PermissionModule } from '../permission/permission.module';

@Module({
  imports: [TypeOrmModule.forFeature([Roles]), PermissionModule],
  controllers: [RoleController],
  providers: [RoleService],
})
export class RoleModule {}
