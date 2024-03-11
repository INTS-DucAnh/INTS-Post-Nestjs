import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '../../entity/user.entity';
import { Categoryies } from '../../entity/category.entity';
import { Posts } from 'src/entity/post.entity';
import { PostCategory } from 'src/entity/post-category.entity';
import { PostImage } from 'src/entity/post-image.entity';
import { Roles } from 'src/entity/role.entity';
import { Permissions } from 'src/entity/permission.entity';
import { RolePermission } from 'src/entity/role-permission.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        type: 'postgres',
        url: config.get<string>('DATABASE_URL'),
        entities: [
          Users,
          Categoryies,
          Posts,
          PostCategory,
          PostImage,
          Roles,
          Permissions,
          RolePermission,
        ],
        synchronize: true,
        migrations: ['src/migration/*.ts'],
      }),
    }),
  ],
})
export class DatabaseModule {}
