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

@UseInterceptors(new ResponseInterceptor())
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthServices,
    private readonly configService: ConfigService,
    private readonly timeUtil: TimeUtil,
  ) {}

  @Post('signup')
  signup(@Body() createUserDto: CreateUserDto) {
    return this.authService.signup(createUserDto, 2);
  }

  @Post('login')
  async login(
    @Body() data: AuthDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken } = await this.authService.login(data);
    console.log(
      this.timeUtil.caltime(this.configService.get<string>('COOKIES_EXPIRE')),
    );
    res.cookie(this.configService.get<string>('COOKIES_NAME'), refreshToken, {
      maxAge: this.timeUtil.caltime(
        this.configService.get<string>('COOKIES_EXPIRE'),
      ),
      httpOnly: true,
      secure: true,
    });

    return accessToken;
  }

  @Get('refresh-token')
  @UseGuards(RefreshTokenGuard)
  refreshAccessToken(@Req() req: UserInRequest) {
    return this.authService.refreshAccessToken(req.user.username);
  }

  @UseGuards(AccessTokenGuard)
  @Get('logout')
  logout(@Req() req: UserInRequest, @Res({ passthrough: true }) res: Response) {
    res.clearCookie(this.configService.get<string>('COOKIES_NAME'));
    return this.authService.logout(req.user.username);
  }
}
