import { BadRequestException, Injectable } from '@nestjs/common';
import { UserServices } from '../user/user.service';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from './dto/auth-create.dto';
import * as argon2 from 'argon2';
import { AuthDto } from './dto/auth.dto';
import { jwtPayload } from './strategies/accesstoken.strategies';
import { MESSAGE_CONSTANT, TOKEN_CONSTANT } from 'src/config/app.constant';
import { RoleTitleEnum } from '../permission/enum/permisison.enum';

@Injectable()
export class AuthServices {
  constructor(
    private userService: UserServices,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async signup(createUser: CreateUserDto) {
    const { roleid, ...user } = createUser;
    const userExists = await this.userService.findUser({
      username: user.username,
    });
    if (userExists)
      throw new BadRequestException(MESSAGE_CONSTANT.auth.badrequest.exist);

    const hashPass = await this.hashData(user.password);
    const createAccount = await this.userService.createUser({
      ...user,
      password: hashPass,
      deletedat: null,
      roleid: roleid,
    });

    const { password, ...props } = createAccount;

    return props;
  }

  async login(userLogin: AuthDto) {
    const userExists = await this.userService.checkValidUser({
      username: userLogin.username,
    });
    const passwordMatch = await argon2.verify(
      userExists.password,
      userLogin.password,
    );
    if (!passwordMatch)
      throw new BadRequestException(
        MESSAGE_CONSTANT.auth.badrequest.incorrect('Password'),
      );
    if (userExists.roleid === RoleTitleEnum.USER) {
      throw new BadRequestException(MESSAGE_CONSTANT.permission.notAllow);
    }

    const token = {
      accessToken: await this.genAToken(
        {
          id: userExists.id,
          username: userExists.username,
          sub: userExists.id.toString(),
        },
        this.configService.get<string>(TOKEN_CONSTANT.jwt.access.secret),
        {
          expiresIn: this.configService.get<string>(
            TOKEN_CONSTANT.jwt.access.expire,
          ),
        },
      ),
      refreshToken: await this.genAToken(
        {
          id: userExists.id,
          username: userExists.username,
          sub: userExists.id.toString(),
        },
        this.configService.get<string>(TOKEN_CONSTANT.jwt.refresh.secret),
        {
          expiresIn: this.configService.get<string>(
            TOKEN_CONSTANT.jwt.refresh.expire,
          ),
        },
      ),
    };
    return token;
  }

  async logout(userid: number) {
    const userExists = await this.userService.checkValidUser(userid);

    return this.userService.updateUser({
      ...userExists,
    });
  }

  async refreshAccessToken(userid: number) {
    const userExists = await this.userService.checkValidUser(userid);
    return await this.genAToken(
      {
        id: userExists.id,
        username: userExists.username,
        sub: userExists.id.toString(),
      },
      this.configService.get<string>(TOKEN_CONSTANT.jwt.access.secret),
      {
        expiresIn: this.configService.get<string>(
          TOKEN_CONSTANT.jwt.access.expire,
        ),
      },
    );
  }

  hashData(data: string) {
    return argon2.hash(data);
  }

  async genAToken(payload: jwtPayload, key: string, options: JwtSignOptions) {
    return this.jwtService.signAsync(payload, {
      secret: key,
      ...options,
    });
  }
}
