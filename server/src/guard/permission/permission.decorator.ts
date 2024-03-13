import { Reflector } from '@nestjs/core';
import { ActionsDto } from './actions.dto';

export const Actions = Reflector.createDecorator<ActionsDto[]>();
