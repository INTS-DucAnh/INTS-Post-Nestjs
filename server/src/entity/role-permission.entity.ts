import { Entity, PrimaryColumn } from 'typeorm';

@Entity('role-permission')
export class RolePermission {
  @PrimaryColumn()
  rid: number;

  @PrimaryColumn()
  pid: number;
}
