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
import { Users } from './user.entity';
import { Categories } from './category.entity';

@Entity('posts')
export class Posts {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text', { nullable: false })
  title: string;

  @Column('jsonb', { nullable: false })
  content: string;

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

  @ManyToMany(() => Categories, (categories: Categories) => categories.posts)
  @JoinTable({
    name: 'post-category',
    joinColumn: {
      name: 'poid',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'cid',
      referencedColumnName: 'id',
    },
  })
  categories?: Categories[];

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

  @DeleteDateColumn({ name: 'deletedat' })
  deletedat: Date;
}
