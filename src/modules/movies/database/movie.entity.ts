import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('movie')
export class MovieDBEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  title!: string;

  @Column()
  description!: string;

  @Column()
  category!: string;

  @Column({ type: 'timestamp with time zone', nullable: true })
  deletedAt?: Date;

  @CreateDateColumn()
  createdAt!: Date;
}
