import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum Events {
  USER_CREATED = 'USER_CREATED',
}

export enum OutboxEventStatus {
  PENDING = 'PENDING',
  SENT = 'SENT',
}

@Entity('outbox')
export class Outbox {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'enum', enum: Events })
  event!: Events;

  @Column()
  payload!: string;

  @Column({ type: 'enum', enum: OutboxEventStatus })
  status!: OutboxEventStatus;

  @CreateDateColumn()
  createdAt!: Date;

  static create(event: Events, payload: string): Outbox {
    const outbox = new Outbox();

    outbox.event = event;
    outbox.payload = payload;
    outbox.status = OutboxEventStatus.PENDING;

    return outbox;
  }
}
