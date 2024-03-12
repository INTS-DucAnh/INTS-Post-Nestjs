import {
  Body,
  Controller,
  Get,
  Post,
  Req,
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
import { PermissionGuard } from 'src/guard/permission/permission.guard';
import { Actions } from 'src/guard/permission/permission.decorator';

@UseInterceptors(new ResponseInterceptor())
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthServices) {}

  @Post('signup')
  signup(@Body() createUserDto: CreateUserDto) {
    return this.authService.signup(createUserDto, 2);
  }

  @Post('login')
  login(@Body() data: AuthDto) {
    return this.authService.login(data);
  }

  @Get('refresh-token')
  @Actions([
    /* {target: "TARGET", action: ["CREATE"| "UDPATE" | "VIEW" | "DELETE"]} */
  ])
  @UseGuards(RefreshTokenGuard)
  refreshAccessToken(@Req() req: UserInRequest) {
    return this.authService.refreshAccessToken(req.user.username);
  }

  @UseGuards(AccessTokenGuard)
  @Get('logout')
  logout(@Req() req: UserInRequest) {
    return this.authService.logout(req.user.username);
  }
}
