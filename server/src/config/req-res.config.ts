import { jwtPayload } from 'src/apps/auth/strategies/accesstoken.strategies';

type jsonRes = {
  success: boolean;
  status: number;
  body: Object;
  message: string;
};

export interface UserInRequest extends Request {
  user: jwtPayload;
}
export interface JsonResInResponse extends Response {
  jsonRes: jsonRes;
}
