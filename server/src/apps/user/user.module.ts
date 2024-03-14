import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/entity/user.entity';
import { UserServices } from './user.service';
import { UserController } from './user.controller';
import { PermissionModule } from '../permission/permission.module';

@Module({
  imports: [TypeOrmModule.forFeature([Users]), PermissionModule],
  controllers: [UserController],
  providers: [UserServices],
  exports: [UserServices],
})
export class UserModule {}
