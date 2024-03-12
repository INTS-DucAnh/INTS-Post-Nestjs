import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

export type jwtPayload = {
  sub: string;
  username: string;
  id: number;
  roleid: number;
};

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.SECRET_ACCESS_TOKEN,
    });
  }
  validate(payload: jwtPayload) {
    return payload;
  }
}
