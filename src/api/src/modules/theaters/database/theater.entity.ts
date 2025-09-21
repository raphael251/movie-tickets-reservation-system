import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('theater')
export class Theater {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;
}
