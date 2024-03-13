import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Posts } from './post.entity';
import { Users } from './user.entity';

@Entity('post-image')
export class PostImage {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Posts, (posts: Posts) => posts.id)
  @JoinColumn({ name: 'poid' })
  posts: Posts[];

  @Column('text', { nullable: false })
  url: string;

  @Column('boolean', { nullable: false, default: false })
  setdefault: boolean;

  @Column('timestamp without time zone', {
    nullable: false,
    default: new Date(),
  })
  createat: Date;

  @ManyToOne(() => Users, (users: Users) => users.id)
  @JoinColumn({ name: 'createby' })
  usersCreate: Users[];

  @Column('timestamp without time zone', {
    nullable: false,
    default: new Date(),
  })
  updateat: Date;

  @Column('integer', { nullable: false })
  updateby: number;

  @ManyToOne(() => Users, (users: Users) => users.id)
  @JoinColumn({ name: 'updateby' })
  usersUpdate: Users[];
}
