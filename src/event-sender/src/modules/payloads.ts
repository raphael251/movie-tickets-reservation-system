import z from 'zod';
import { Events } from './database/outbox.entity.ts';

export type EventPayload = {
  event: Events;
};

export const userCreatedEventPayloadSchema = z.object({
  event: z.literal<Events.USER_CREATED>(Events.USER_CREATED),
  email: z.string(),
});

export type UserCreatedEventPayload = z.infer<typeof userCreatedEventPayloadSchema>;
