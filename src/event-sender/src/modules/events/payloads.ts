import { Events } from './database/outbox.entity.ts';

export type EventPayload = {
  event: Events.USER_CREATED;
  email: string;
};
