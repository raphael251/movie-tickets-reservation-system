import { AppConfig } from '../../shared/configs/app-config.ts';
import { appDataSource } from '../../shared/data-source/data-source.ts';
import { decodeCursor, encodeCursor } from '../../shared/pagination/helpers.ts';
import { IPaginationParams, TPaginationResponse } from '../../shared/pagination/types.ts';
import { Movie } from '../database/movie.entity.ts';
import { IMovieRepository } from './interfaces/movie.repository.ts';

export class MovieRepository implements IMovieRepository {
  constructor(private appConfig: AppConfig) {}

  async save(movie: Movie): Promise<void> {
    await appDataSource.getRepository(Movie).upsert(movie, {
      conflictPaths: ['id'],
      skipUpdateIfNoValuesChanged: true,
    });
  }

  async findById(movieId: string): Promise<Movie | null> {
    return appDataSource.getRepository(Movie).findOne({ where: { id: movieId } });
  }

  async findPaginated({ cursor, limit }: IPaginationParams): Promise<TPaginationResponse<Movie>> {
    // Increasing the number of retrieved registers to check if there is a next page
    const limitWithNextPageFirstElement = (limit || this.appConfig.PAGINATION_DEFAULT_LIMIT) + 1 + 1;

    const query = appDataSource
      .createQueryBuilder(Movie, 'movie')
      .where('movie.deletedAt IS NULL')
      .orderBy('movie.createdAt', 'DESC')
      .take(limitWithNextPageFirstElement);

    if (cursor) {
      const decodedCursor = decodeCursor(cursor);

      query.andWhere('movie.createdAt < :cursor', { cursor: new Date(Number(decodedCursor)) });
    }

    const movies = await query.getMany();
    const moviesToReturn = movies.slice(0, -1);

    const hasNext = movies.length === limitWithNextPageFirstElement;

    if (hasNext)
      return {
        data: moviesToReturn,
        hasNext: true,
        nextCursor: encodeCursor(moviesToReturn[moviesToReturn.length - 1].createdAt.valueOf().toString()),
      };

    return {
      data: movies,
      hasNext: false,
      nextCursor: undefined,
    };
  }

  async deleteById(movieId: string): Promise<void> {
    await appDataSource.getRepository(Movie).update({ id: movieId }, { deletedAt: new Date() });
  }
}
