//--------------------------------------------------------------------------------------------------------------------

import {
  Entity,
  Column,
  PrimaryColumn,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

//--------------------------------------------------------------------------------------------------------------------

@Entity({ name: 'tokenz' })
class Token {
  @PrimaryColumn({ type: 'char', length: 64 })
  @Index()
  id: string;

  @Column()
  @Index()
  email: string;

  @Column({ type: 'bigint' })
  expiresAt: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'email', referencedColumnName: 'email' })
  user: User;
}

export { Token };
