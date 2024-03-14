import {
  ChildEntity,
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Categories } from './category.entity';
import { ModifyEntity } from './modify.entity';

@Entity('posts')
export class Posts extends ModifyEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text', { nullable: false })
  title: string;

  @Column('text', { nullable: false })
  content: string;

  @Column('text', { nullable: false })
  thumbnail: string;

  @ManyToMany(() => Categories, (categories: Categories) => categories.posts)
  @JoinTable({
    name: 'post-category',
    joinColumn: {
      name: 'poid',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'cid',
    },
  })
  categories?: Categories[];

  @DeleteDateColumn({ name: 'deletedat' })
  deletedat: Date;
}
