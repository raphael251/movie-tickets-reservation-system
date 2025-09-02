import { Container } from 'inversify';
import { CancelReservationController } from '../http/controllers/cancel.ts';
import { CreateReservationController } from '../http/controllers/create.ts';
import { ListReservationsController } from '../http/controllers/list.ts';
import { CancelReservationUseCase } from '../use-cases/cancel.ts';
import { CreateReservationUseCase } from '../use-cases/create.ts';
import { ReservationRepository } from '../repositories/reservation.repository.ts';

export function createDependenciesContainer(container: Container): Container {
  // Controllers
  container.bind(CancelReservationController).toSelf();
  container.bind(CreateReservationController).toSelf();
  container.bind(ListReservationsController).toSelf();

  // Use Cases
  container.bind(CancelReservationUseCase).toSelf();
  container.bind(CreateReservationUseCase).toSelf();

  // Repositories
  container.bind(ReservationRepository).toSelf();

  return container;
}
