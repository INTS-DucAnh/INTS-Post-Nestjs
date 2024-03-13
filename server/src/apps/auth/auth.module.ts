import { Module } from '@nestjs/common';
import { AuthServices } from './auth.services';
import { AuthController } from './auth.controller';
import { AccessTokenStrategy } from './strategies/accesstoken.strategies';
import { RefreshTokenStrategy } from './strategies/refreshtoken.strategies';
import { UserModule } from '../user/user.module';
import { JwtService } from '@nestjs/jwt';
import { PermissionModule } from '../permission/permission.module';
import { TimeUtil } from './utils/time.util';

@Module({
  imports: [UserModule, PermissionModule],
  controllers: [AuthController],
  providers: [
    JwtService,
    AuthServices,
    AccessTokenStrategy,
    RefreshTokenStrategy,
    TimeUtil,
  ],
})
export class AuthModule {}
