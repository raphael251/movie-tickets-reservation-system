import { Container } from 'inversify';
import { ScreeningRepository } from '../repositories/screening.repository.ts';
import { CreateScreeningController } from '../http/controllers/create.ts';
import { ListScreeningSeatsController } from '../http/controllers/list-screening-seats.ts';
import { ListScreeningsController } from '../http/controllers/list-screenings.ts';
import { CreateScreeningUseCase } from '../use-cases/create.ts';
import { TheaterRepository } from '../../theaters/repositories/theater.repository.ts';

export function createDependenciesContainer(container: Container): Container {
  // Controllers
  container.bind(CreateScreeningController).toSelf();
  container.bind(ListScreeningSeatsController).toSelf();
  container.bind(ListScreeningsController).toSelf();

  // Use Cases
  container.bind(CreateScreeningUseCase).toSelf();

  // Repositories
  container.bind(ScreeningRepository).toSelf();
  container.bind(TheaterRepository).toSelf();

  return container;
}
