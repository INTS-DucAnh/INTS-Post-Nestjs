export type UpdateUserDto = {
  id: number;
  password?: string;
  birthday?: Date;
  gender?: string;
  firstname?: string;
  lastname?: string;
  avatar?: string;
  online?: boolean;
};
