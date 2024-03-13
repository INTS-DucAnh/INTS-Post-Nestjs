import { ForbiddenException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtPayload } from './accesstoken.strategies';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        RefreshTokenStrategy.extractJWTFromCookies,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      secretOrKey: process.env.SECRET_REFRESH_TOKEN,
      passReqToCallback: true,
    });
  }
  validate(req: Request, payload: jwtPayload) {
    const refreshToken: string =
      RefreshTokenStrategy.extractJWTFromCookies(req);
    if (!req) throw new ForbiddenException('Can not find refresh token');

    return { ...payload, refreshToken };
  }
  static extractJWTFromCookies(req: Request): string | null {
    if (req.cookies && req.cookies[process.env.COOKIES_NAME]) {
      return req.cookies[process.env.COOKIES_NAME];
    }
    return null;
  }
}
