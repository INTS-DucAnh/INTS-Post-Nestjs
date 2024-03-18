import { Reflector } from '@nestjs/core';
import { RoleTitleEnum } from 'src/apps/permission/enum/permisison.enum';

export const Roles = Reflector.createDecorator<RoleTitleEnum[]>();
