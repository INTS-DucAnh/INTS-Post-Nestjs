import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Roles } from './role.entity';
import { Gender } from 'src/apps/auth/dto/auth-create.dto';

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

  @Column('boolean', { nullable: false, default: false })
  online: boolean;

  @Column('varchar', { nullable: false })
  password: string;

  @DeleteDateColumn({ name: 'deletedat' })
  deletedat: Date;
}
