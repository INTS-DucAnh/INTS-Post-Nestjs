import { Users } from 'src/entity/user.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Posts } from './post.entity';

@Entity('categories')
export class Categories {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text', { nullable: false })
  title: string;

  @Column('integer', { nullable: false })
  updateby: number;

  @Column('integer', { nullable: false })
  createby: number;

  @ManyToOne(() => Users, (users: Users) => users.id)
  @JoinColumn({ name: 'updateby' })
  usersUpdate: Users[];

  @ManyToOne(() => Users, (users: Users) => users.id)
  @JoinColumn({ name: 'createby' })
  usersCreate: Users[];

  @Column('timestamp without time zone', {
    nullable: false,
    default: new Date(),
  })
  updateat: Date;

  @Column('timestamp without time zone', {
    nullable: false,
    default: new Date(),
  })
  createat: Date;

  @ManyToMany(() => Posts, (posts: Posts) => posts.categories, {
    onDelete: 'CASCADE',
    onUpdate: 'RESTRICT',
  })
  posts: Posts[];

  @DeleteDateColumn({ name: 'deletedat' })
  deletedat: Date;
}
