import { randomUUID } from 'node:crypto';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('movie')
export class Movie {
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

  static create(title: string, description: string, category: string): Movie {
    const movie = new Movie();

    movie.id = randomUUID();
    movie.title = title;
    movie.description = description;
    movie.category = category;
    movie.createdAt = new Date();

    return movie;
  }
}
