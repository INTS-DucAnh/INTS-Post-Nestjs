import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Users } from './user.entity';

@Entity('post-category')
export class PostCategory {
  @PrimaryColumn()
  poid: number;

  @PrimaryColumn()
  cid: number;

  // @Column('integer', { nullable: true })
  // updateby: number;

  // @ManyToOne(() => Users, (users: Users) => users.id)
  // @JoinColumn({ name: 'updateby' })
  // users: Users[];

  // @Column('timestamp without time zone', { nullable: true })
  // updateat: Date;
}
