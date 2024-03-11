import { Post } from '@nestjs/common';
import { Users } from 'src/entity/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Posts } from './post.entity';

@Entity('categories')
export class Categoryies {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text', { nullable: false })
  title: string;

  @ManyToOne(() => Users, (users: Users) => users.id)
  @JoinColumn({ name: 'updateny' })
  users: Users[];

  @Column('timestamp without time zone', { nullable: false })
  updateat: Date;

  @ManyToMany(() => Posts, (posts: Posts) => posts.categories)
  posts: Posts[];
}
