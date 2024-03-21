import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthServices } from './auth.services';
import { AuthDto } from './dto/auth.dto';
import { CreateUserDto } from './dto/auth-create.dto';
import { ResponseInterceptor } from 'src/interceptor/response.interceptor';
import { AccessTokenGuard } from 'src/guard/jwt/accesstoken.guard';
import { UserInRequest } from 'src/config/req-res.config';
import { RefreshTokenGuard } from 'src/guard/jwt/refreshtoken.guard';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { TimeUtil } from './utils/time.util';
import { Roles } from 'src/guard/permission/permission.decorator';
import { RoleTitleEnum } from '../permission/enum/permisison.enum';
import { PermissionGuard } from 'src/guard/permission/permission.guard';
import { COOKIES_CONSTANT } from 'src/config/app.constant';

@UseInterceptors(new ResponseInterceptor())
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthServices,
    private readonly configService: ConfigService,
    private readonly timeUtil: TimeUtil,
  ) {}

  @Roles([RoleTitleEnum.ADMIN])
  @UseGuards(AccessTokenGuard, PermissionGuard)
  @Post('create')
  signup(@Body() createUserDto: CreateUserDto) {
    return this.authService.signup(createUserDto);
  }
  @Post('login')
  async login(
    @Body() data: AuthDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken } = await this.authService.login(data);
    res.cookie(
      this.configService.get<string>(COOKIES_CONSTANT.name),
      refreshToken,
      {
        maxAge: this.timeUtil.caltime(
          this.configService.get<string>(COOKIES_CONSTANT.expire),
        ),
        httpOnly: true,
        secure: true,
        sameSite: 'none',
      },
    );

    return accessToken;
  }

  @Get('refresh-token')
  @UseGuards(RefreshTokenGuard)
  refreshAccessToken(@Req() req: UserInRequest) {
    return this.authService.refreshAccessToken(req.user.id);
  }

  @UseGuards(AccessTokenGuard)
  @Get('logout')
  logout(@Req() req: UserInRequest, @Res({ passthrough: true }) res: Response) {
    res.clearCookie(this.configService.get<string>(COOKIES_CONSTANT.name));
    return this.authService.logout(req.user.id);
  }
}
