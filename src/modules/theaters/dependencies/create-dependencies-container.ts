import { Container } from 'inversify';
import { TheaterRepository } from '../repositories/theater.repository.ts';

export function createDependenciesContainer(container: Container): Container {
  // Repositories
  container.bind(TheaterRepository).toSelf();

  return container;
}
