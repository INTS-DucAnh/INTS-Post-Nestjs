import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Users } from './user.entity';
import { Categoryies } from './category.entity';

@Entity('posts')
export class Posts {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text', { nullable: false })
  title: string;

  @Column('jsonb', { nullable: false })
  content: Object;

  @ManyToOne(() => Users, (users: Users) => users.id)
  @JoinColumn({ name: 'updateby' })
  users: Users[];

  @ManyToMany(() => Categoryies, (categories: Categoryies) => categories.posts)
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
  categories?: Categoryies[];

  @Column('timestamp without time zone')
  updateat: Date;
}
