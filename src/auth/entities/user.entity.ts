//--------------------------------------------------------------------------------------------------------------------

import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Role } from '../enums/role.enum';

//--------------------------------------------------------------------------------------------------------------------

@Entity({ name: 'users' })
class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password?: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.AUDITOR,
  })
  role: Role;

  public clearPassword(): SafeUser {
    const { email, id, role }: User = this;
    return { email, id, role };
  }
}

type SafeUser = Omit<User, 'password' | 'clearPassword'>;

export { User };

export type { SafeUser };
