import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text', { nullable: false })
  firstname: string;

  @Column('text', { nullable: false })
  lastname: string;

  @Column('date', { nullable: true })
  birthday: Date;

  @Column('text', { nullable: true })
  avatar: string;

  @Column({ nullable: false })
  roleid: number;

  @Column('text', { nullable: true })
  description: string;
}
