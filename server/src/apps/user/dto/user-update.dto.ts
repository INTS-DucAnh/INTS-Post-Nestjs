import {
  IsBoolean,
  IsDate,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsStrongPassword,
  IsUrl,
  Validate,
} from 'class-validator';
import { UserGenderValidator } from '../validator/user-gender.validator';
import { Gender } from 'src/apps/auth/dto/auth-create.dto';

export class UpdateUserDto {
  @IsNotEmpty()
  @IsInt()
  id: number;

  @IsOptional()
  @IsString()
  birthday?: Date;

  @IsOptional()
  @Validate(UserGenderValidator)
  gender?: Gender;

  @IsOptional()
  @IsString()
  firstname?: string;

  @IsOptional()
  @IsString()
  lastname?: string;

  @IsOptional()
  @IsBoolean()
  online?: boolean;

  @IsOptional()
  @IsStrongPassword()
  password?: string;

  @IsOptional()
  avatar?: string;

  @IsOptional()
  @IsInt()
  roleid?: number;
}

export type ChangPasswordDto = {
  newPassword: string;
  oldPassword: string;
};
