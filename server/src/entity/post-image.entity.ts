import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Posts } from './post.entity';

@Entity('post-image')
export class PostImage {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Posts, (posts: Posts) => posts.id)
  @JoinColumn({ name: 'poid' })
  posts: Posts[];

  @Column('text', { nullable: false })
  url: string;
}
