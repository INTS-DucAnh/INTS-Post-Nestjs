import {
  Column,
  CreateDateColumn,
  JoinColumn,
  ManyToOne,
  UpdateDateColumn,
} from 'typeorm';
import { Users } from './user.entity';

export abstract class ModifyEntity {
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

  @UpdateDateColumn()
  updateat: Date;

  @CreateDateColumn()
  createat: Date;
}
