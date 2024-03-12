import { ForbiddenException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtPayload } from './accesstoken.strategies';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.SECRET_REFRESH_TOKEN,
      passReqToCallback: true,
    });
  }
  validate(req: Request, payload: jwtPayload) {
    const bearer: string = req.headers['authorization'];
    if (!bearer) throw new ForbiddenException('Can not find refresh token');

    const refreshToken = bearer.replace('Bearer', '').trim();
    return { ...payload, refreshToken };
  }
}
