import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Roles } from './role.entity';
import { Gender } from 'src/apps/auth/dto/auth-create.dto';
import { Categories } from './category.entity';
import { PostCategory } from './post-category.entity';

@Entity('users')
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text', { nullable: false })
  firstname: string;

  @Column('text', { nullable: false })
  lastname: string;

  @Column('text', { nullable: true })
  gender: Gender;

  @Column('date', { nullable: true, default: '1990/01/01' })
  birthday: Date;

  @Column('text', { nullable: true })
  avatar: string;

  @Column('integer', { nullable: false })
  roleid: number;

  @ManyToOne(() => Roles, (roles: Roles) => roles.id)
  @JoinColumn({ name: 'roleid' })
  roles: Roles[];

  @Column('varchar', { nullable: false, unique: true })
  username: string;

  @Column('varchar', { nullable: false })
  password: string;

  @DeleteDateColumn({ name: 'deletedat' })
  deletedat: Date;

  @OneToMany(
    () => Categories,
    (categories: Categories) => categories.usersCreate,
  )
  createCategories: Categories[];

  @OneToMany(
    () => Categories,
    (categories: Categories) => categories.usersUpdate,
  )
  updateCategories: Categories[];

  @OneToMany(
    () => PostCategory,
    (postCategory: PostCategory) => postCategory.users,
  )
  updatePostCategory: PostCategory[];
}
