import {
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  Validate,
} from 'class-validator';
import { UserGenderValidator } from 'src/apps/user/validator/user-gender.validator';

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
  @Validate(UserGenderValidator)
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
