import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/entity/user.entity';
import { UserServices } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([Users])],
  providers: [UserServices],
  exports: [UserServices],
})
export class UserModule {}
