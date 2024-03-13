import { IsString } from 'class-validator';

export type AuthDto = {
  username: string;

  password: string;
};
