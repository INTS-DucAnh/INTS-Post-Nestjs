import {
  IsBoolean,
  IsDate,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Validate,
} from 'class-validator';
import { UserGenderValidator } from '../validator/user-gender.validator';
import { Gender } from 'src/apps/auth/dto/auth-create.dto';

export class UpdateUserDto {
  @IsNotEmpty()
  @IsInt()
  id: number;

  @IsOptional()
  @IsDate()
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
}

export type ChangPasswordDto = {
  newPassword: string;
  oldPassword: string;
};
