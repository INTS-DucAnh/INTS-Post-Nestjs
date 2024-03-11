import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Permissions } from './permission.entity';

@Entity('roles')
export class Roles {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text', { nullable: false })
  title: string;

  @Column('boolean', { nullable: false, default: true })
  active: boolean;

  @ManyToMany(
    () => Permissions,
    (permissions: Permissions) => permissions.roles,
  )
  @JoinTable({
    name: 'role-permission',
    joinColumn: {
      name: 'rid',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'pid',
      referencedColumnName: 'id',
    },
  })
  permissions: Permissions[];
}
