import { BadRequestException, Injectable } from '@nestjs/common';
import { UserServices } from '../user/user.service';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from './dto/auth-create.dto';
import * as argon2 from 'argon2';
import { AuthDto } from './dto/auth.dto';
import { jwtPayload } from './strategies/accesstoken.strategies';
import { RolesIdEnum } from 'src/guard/permission/roles.enum';

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
    if (userExists) throw new BadRequestException('This user already exist!');

    const hashPass = await this.hashData(user.password);
    const createAccount = await this.userService.createUser({
      ...user,
      avatar: '',
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
    if (!passwordMatch) throw new BadRequestException('Password is incorrect!');

    const token = {
      accessToken: await this.genAToken(
        {
          id: userExists.id,
          username: userExists.username,
          sub: userExists.id.toString(),
        },
        this.configService.get<string>('SECRET_ACCESS_TOKEN'),
        {
          expiresIn: this.configService.get<string>('ACCESS_TOKEN_EXPIRE'),
        },
      ),
      refreshToken: await this.genAToken(
        {
          id: userExists.id,
          username: userExists.username,
          sub: userExists.id.toString(),
        },
        this.configService.get<string>('SECRET_REFRESH_TOKEN'),
        {
          expiresIn: this.configService.get<string>('REFRESH_TOKEN_EXPIRE'),
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
    if (!userExists) throw new BadRequestException('This user is not exist!');
    return await this.genAToken(
      {
        id: userExists.id,
        username: userExists.username,
        sub: userExists.id.toString(),
      },
      this.configService.get<string>('SECRET_ACCESS_TOKEN'),
      {
        expiresIn: this.configService.get<string>('ACCESS_TOKEN_EXPIRE'),
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
