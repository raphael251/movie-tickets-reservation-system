import { Container } from 'inversify';
import { CreateMovieController } from '../../movies/http/controllers/create.ts';
import { DeleteMovieController } from '../../movies/http/controllers/delete.ts';
import { ListMoviesController } from '../../movies/http/controllers/list.ts';
import { UpdateMovieController } from '../../movies/http/controllers/update.ts';
import { MovieRepository } from '../../movies/repositories/movie.repository.ts';
import { CreateMovieUseCase } from '../../movies/use-cases/create.ts';
import { DeleteMovieUseCase } from '../../movies/use-cases/delete.ts';
import { UpdateMovieUseCase } from '../../movies/use-cases/update.ts';
import { AppConfig } from '../configs/app-config.ts';
import { WinstonLogger } from '../logger/winston-logger.ts';
import { createDependenciesContainer as createReservationsDependenciesContainer } from '../../reservations/dependencies/create-dependencies-container.ts';
import { createDependenciesContainer as createScreeningsDependenciesContainer } from '../../screenings/dependencies/create-dependencies-container.ts';
import { createDependenciesContainer as createTheatersDependenciesContainer } from '../../theaters/dependencies/create-dependencies-container.ts';
import { createDependenciesContainer as createUsersDependenciesContainer } from '../../users/dependencies/create-dependencies-container.ts';
import { Hasher } from '../security/hasher.ts';

export function createDependenciesContainer(appConfig: AppConfig): Container {
  const container = new Container();

  createReservationsDependenciesContainer(container);
  createScreeningsDependenciesContainer(container);
  createTheatersDependenciesContainer(container);
  createUsersDependenciesContainer(container);

  // Controllers - movies
  container.bind(CreateMovieController).toSelf();
  container.bind(DeleteMovieController).toSelf();
  container.bind(ListMoviesController).toSelf();
  container.bind(UpdateMovieController).toSelf();

  // Use Cases
  container.bind(CreateMovieUseCase).toSelf();
  container.bind(UpdateMovieUseCase).toSelf();
  container.bind(DeleteMovieUseCase).toSelf();

  // Repositories
  container.bind(MovieRepository).toSelf();

  // Logger
  container.bind(WinstonLogger).toSelf();

  // App Config
  container.bind<AppConfig>(AppConfig).toConstantValue(appConfig);

  // Hasher
  container.bind(Hasher).toSelf();

  return container;
}
