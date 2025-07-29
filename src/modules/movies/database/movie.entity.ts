import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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

  @Column()
  room!: string;

  @Column()
  startTime!: Date;

  @Column()
  endTime!: Date;
}
