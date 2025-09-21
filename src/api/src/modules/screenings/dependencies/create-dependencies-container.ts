import { Container } from 'inversify';
import { ScreeningRepository } from '../repositories/screening.repository.ts';
import { CreateScreeningController } from '../http/controllers/create.ts';
import { ListScreeningSeatsController } from '../http/controllers/list-screening-seats.ts';
import { ListScreeningsController } from '../http/controllers/list-screenings.ts';
import { CreateScreeningUseCase } from '../use-cases/create.ts';
import { ReadScreeningSeatController } from '../http/controllers/read-screening-seat.ts';

export function createDependenciesContainer(container: Container): Container {
  // Controllers
  container.bind(CreateScreeningController).toSelf();
  container.bind(ListScreeningSeatsController).toSelf();
  container.bind(ListScreeningsController).toSelf();
  container.bind(ReadScreeningSeatController).toSelf();

  // Use Cases
  container.bind(CreateScreeningUseCase).toSelf();

  // Repositories
  container.bind(ScreeningRepository).toSelf();

  return container;
}
