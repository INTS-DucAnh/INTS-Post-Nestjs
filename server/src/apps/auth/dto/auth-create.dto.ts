export type CreateUserDto = {
  username: string;
  password: string;
  gender: string;
  firstname: string;
  lastname: string;
  avatar?: string;
  birthday?: Date;
  online?: boolean;
};
