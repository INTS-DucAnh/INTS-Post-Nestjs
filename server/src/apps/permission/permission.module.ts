import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionService } from './permission.service';
import { RolePermission } from 'src/entity/role-permission.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RolePermission])],
  providers: [PermissionService],
  exports: [PermissionService],
})
export class PermissionModule {}
