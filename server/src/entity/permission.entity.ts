import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Roles } from './role.entity';

@Entity('permisisons')
export class Permissions {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text', { nullable: false })
  action: string;

  @Column('text', { nullable: false })
  target: string;

  @ManyToMany(() => Roles, (roles: Roles) => roles.permissions)
  roles: Roles[];
}
