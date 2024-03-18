import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { Categories } from 'src/entity/category.entity';
import { PostCategory } from 'src/entity/post-category.entity';
import { Posts } from 'src/entity/post.entity';
import { Roles } from 'src/entity/role.entity';
import { Users } from 'src/entity/user.entity';

@Injectable()
export class DatabaseConfigService implements TypeOrmOptionsFactory {
  constructor(private readonly configService: ConfigService) {}
  createTypeOrmOptions(
    connectionName?: string,
  ): TypeOrmModuleOptions | Promise<TypeOrmModuleOptions> {
    return {
      type: 'postgres',
      host: this.configService.get<string>('DB_HOST'),
      port: this.configService.get<number>('DB_PORT'),
      username: this.configService.get<string>('DB_USERNAME'),
      password: this.configService.get<string>('DB_PASSWORD'),
      database: this.configService.get<string>('DB_NAME'),
      entities: [Users, Roles, Posts, Categories, PostCategory],
      synchronize: true,
    };
  }
}
