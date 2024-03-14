import { Users } from 'src/entity/user.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Posts } from './post.entity';
import { ModifyEntity } from './modify.entity';

@Entity('categories')
export class Categories extends ModifyEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text', { nullable: false })
  title: string;

  @ManyToMany(() => Posts, (posts: Posts) => posts.categories, {
    onDelete: 'CASCADE',
    onUpdate: 'RESTRICT',
  })
  @JoinTable({
    name: 'post-category',
    joinColumn: {
      name: 'cid',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'poid',
    },
  })
  posts: Posts[];

  @DeleteDateColumn({ name: 'deletedat' })
  deletedat: Date;
}
