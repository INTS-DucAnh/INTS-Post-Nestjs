import { Injectable } from '@nestjs/common';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Gender } from 'src/apps/auth/dto/auth-create.dto';

@ValidatorConstraint({ name: 'UserGender', async: true })
@Injectable()
export class UserGenderValidator implements ValidatorConstraintInterface {
  async validate(value: string) {
    return Object.values(Gender).includes(value as Gender);
  }

  defaultMessage(args: ValidationArguments) {
    return `Gender can be F, M, O`;
  }
}
