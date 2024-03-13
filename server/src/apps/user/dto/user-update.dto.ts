export type UpdateUserDto = {
  id: number;
  birthday?: Date;
  gender?: string;
  firstname?: string;
  lastname?: string;
  avatar?: string;
  online?: boolean;
};

export type ChangPasswordDto = {
  newPassword: string;
  oldPassword: string;
};
