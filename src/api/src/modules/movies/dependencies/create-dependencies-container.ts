import { Container } from 'inversify';
import { CreateMovieController } from '../http/controllers/create.ts';
import { DeleteMovieController } from '../http/controllers/delete.ts';
import { ListMoviesController } from '../http/controllers/list.ts';
import { UpdateMovieController } from '../http/controllers/update.ts';
import { MovieRepository } from '../repositories/movie.repository.ts';
import { CreateMovieUseCase } from '../use-cases/create.ts';
import { DeleteMovieUseCase } from '../use-cases/delete.ts';
import { UpdateMovieUseCase } from '../use-cases/update.ts';

export function createDependenciesContainer(container: Container): Container {
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

  return container;
}
