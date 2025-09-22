import { injectable } from 'inversify';
import { appDataSource } from '../data-source/data-source.ts';
import { Outbox } from '../database/outbox.entity.ts';
import { EventPayload } from '../payloads.ts';
import { IEventRepository } from './interfaces/event.repository.ts';

@injectable()
export class EventRepository implements IEventRepository {
  private typeormRepository = appDataSource.getRepository(Outbox);

  async create(payload: EventPayload): Promise<void> {
    await this.typeormRepository.insert(Outbox.create(payload.event, JSON.stringify(payload)));
  }
}
