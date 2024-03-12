import { BadRequestException, Injectable } from '@nestjs/common';
import { UserServices } from '../user/user.service';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from './dto/auth-create.dto';
import * as argon2 from 'argon2';
import { AuthDto } from './dto/auth.dto';
import { jwtPayload } from './strategies/accesstoken.strategies';

@Injectable()
export class AuthServices {
  constructor(
    private userService: UserServices,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async signup(createUser: CreateUserDto, roleid: number) {
    const userExists = await this.userService.findUser({
      username: createUser.username,
    });
    if (userExists) throw new BadRequestException('This user already exist!');

    const hashPass = await this.hashData(createUser.password);
    const createAccount = await this.userService.createUser(
      {
        ...createUser,
        password: hashPass,
      },
      roleid,
    );

    const { password, ...props } = createAccount;

    return props;
  }

  async login(userLogin: AuthDto) {
    const userExists = await this.userService.findUser({
      username: userLogin.username,
    });
    if (!userExists) throw new BadRequestException('This user is not exist!');
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
          roleid: userExists.roleid,
          sub: userExists.id.toString(),
        },
        this.configService.get<string>('SECRET_ACCESS_TOKEN'),
        {
          expiresIn: '15m',
        },
      ),
      refreshToken: await this.genAToken(
        {
          id: userExists.id,
          username: userExists.username,
          roleid: userExists.roleid,
          sub: userExists.id.toString(),
        },
        this.configService.get<string>('SECRET_REFRESH_TOKEN'),
        {
          expiresIn: '7d',
        },
      ),
    };
    const updateLogin = await this.userService.updateUser({
      ...userExists,
      online: true,
    });
    return token;
  }

  async logout(username: string) {
    const userExists = await this.userService.findUser({
      username: username,
    });
    return this.userService.updateUser({
      ...userExists,
      online: false,
    });
  }

  async refreshAccessToken(username: string) {
    const userExists = await this.userService.findUser({
      username: username,
    });
    if (!userExists) throw new BadRequestException('This user is not exist!');
    return await this.genAToken(
      {
        id: userExists.id,
        username: userExists.username,
        roleid: userExists.roleid,
        sub: userExists.id.toString(),
      },
      this.configService.get<string>('SECRET_ACCESS_TOKEN'),
      {
        expiresIn: '15m',
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
