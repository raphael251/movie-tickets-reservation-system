import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('reservation')
export class ReservationDBEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  userId!: string;

  @Column()
  screeningId!: string;

  @Column()
  seatCode!: string;

  @Column()
  expiresAt!: Date;
}
