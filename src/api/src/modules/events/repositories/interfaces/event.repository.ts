import { EventPayload } from '../../payloads.ts';

export interface IEventRepository {
  create(payload: EventPayload): Promise<void>;
}
