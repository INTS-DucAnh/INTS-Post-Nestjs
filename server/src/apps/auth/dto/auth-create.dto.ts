import { IsNotEmpty, IsString, IsStrongPassword } from 'class-validator';

export enum Gender {
  MALE = 'M',
  FEMALE = 'F',
  OTHERS = 'O',
}
export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsStrongPassword()
  password: string;

  @IsNotEmpty()
  @IsString()
  gender: Gender;

  @IsNotEmpty()
  @IsString()
  firstname: string;

  @IsNotEmpty()
  @IsString()
  lastname: string;

  @IsNotEmpty()
  @IsString()
  birthday: Date;
}
