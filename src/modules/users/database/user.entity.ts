import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user')
export class UserDBEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  email!: string;

  @Column({ enum: ['admin', 'regular'], default: 'regular', type: 'enum' })
  role!: 'admin' | 'regular';

  @Column()
  password!: string;
}
