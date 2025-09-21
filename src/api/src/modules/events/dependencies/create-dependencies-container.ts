import { Container } from 'inversify';
import { EventRepository } from '../repositories/event.repository.ts';

export function createDependenciesContainer(container: Container): Container {
  // Repositories
  container.bind(EventRepository).toSelf();

  return container;
}
