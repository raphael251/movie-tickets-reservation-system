import { Container } from 'inversify';
import { AppConfig } from '../configs/app-config.ts';
import { WinstonLogger } from '../logger/winston-logger.ts';
import { createDependenciesContainer as createMoviesDependenciesContainer } from '../../movies/dependencies/create-dependencies-container.ts';
import { createDependenciesContainer as createReservationsDependenciesContainer } from '../../reservations/dependencies/create-dependencies-container.ts';
import { createDependenciesContainer as createScreeningsDependenciesContainer } from '../../screenings/dependencies/create-dependencies-container.ts';
import { createDependenciesContainer as createTheatersDependenciesContainer } from '../../theaters/dependencies/create-dependencies-container.ts';
import { createDependenciesContainer as createUsersDependenciesContainer } from '../../users/dependencies/create-dependencies-container.ts';
import { createDependenciesContainer as createEventsDependenciesContainer } from '../../events/dependencies/create-dependencies-container.ts';
import { Hasher } from '../security/hasher.ts';

export function createDependenciesContainer(appConfig: AppConfig): Container {
  const container = new Container();

  createMoviesDependenciesContainer(container);
  createReservationsDependenciesContainer(container);
  createScreeningsDependenciesContainer(container);
  createTheatersDependenciesContainer(container);
  createUsersDependenciesContainer(container);
  createEventsDependenciesContainer(container);

  // Logger
  container.bind(WinstonLogger).toSelf();

  // App Config
  container.bind<AppConfig>(AppConfig).toConstantValue(appConfig);

  // Hasher
  container.bind(Hasher).toSelf();

  return container;
}
