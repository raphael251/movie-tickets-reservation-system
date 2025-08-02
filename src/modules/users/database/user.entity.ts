import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { UserRole } from '../util/constants/roles.ts';

@Entity('user')
export class UserDBEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  email!: string;

  @Column({ enum: UserRole, default: UserRole.REGULAR, type: 'enum' })
  role!: UserRole;

  @Column()
  password!: string;
}
