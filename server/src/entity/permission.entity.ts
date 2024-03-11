import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Roles } from './role.entity';

@Entity('permisisons')
export class Permissions {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('character', { nullable: false })
  action: string;

  @Column('character', { nullable: false })
  target: string;

  @ManyToMany(() => Roles, (roles: Roles) => roles.permissions)
  roles: Roles[];
}
