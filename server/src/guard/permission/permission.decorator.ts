import { Reflector } from '@nestjs/core';

export const Actions =
  Reflector.createDecorator<Array<{ target: string; action: string[] }>>();
