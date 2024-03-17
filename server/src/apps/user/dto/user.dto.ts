import { Gender } from 'src/apps/auth/dto/auth-create.dto';

export type UserDto = {
  id?: number;
  birthday: Date;
  password: string;
  gender: Gender;
  roleid: number;
  firstname: string;
  lastname: string;
  avatar: string;
  deletedat: Date;
};
