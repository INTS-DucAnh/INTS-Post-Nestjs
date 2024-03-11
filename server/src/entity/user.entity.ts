import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text', { nullable: false })
  firstname: string;

  @Column('text', { nullable: false })
  lastname: string;

  @Column('text', { nullable: true })
  gender: string;

  @Column('date', { nullable: true })
  birthday: Date;

  @Column('text', { nullable: true })
  avatar: string;

  @Column({ nullable: false })
  roleid: number;

  @Column('varchar', { nullable: false, unique: true })
  username: string;

  @Column('boolean', { nullable: false, default: false })
  online: boolean;

  @Column('varchar', { nullable: false })
  password: string;
}
