type Gender = 'M' | 'F' | 'O';
export type CreateUserDto = {
  username: string;
  password: string;
  gender: Gender;
  firstname: string;
  lastname: string;
  avatar?: string;
  birthday?: Date;
  online?: boolean;
};
