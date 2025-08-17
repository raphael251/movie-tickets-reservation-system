import { encodeCursor, IPaginationParams, TPaginationResponse } from '../../shared/pagination/index.ts';
import { MovieDBEntity } from '../database/movie.entity.ts';
import { Movie } from '../entities/movie.ts';
import { IMovieRepository } from './interfaces/movie.repository.ts';

export class MovieRepository implements IMovieRepository {
  async save(movie: Movie): Promise<void> {
    await MovieDBEntity.upsert(movie, {
      conflictPaths: ['id'],
      skipUpdateIfNoValuesChanged: true,
    });
  }

  async findById(movieId: string): Promise<Movie | null> {
    const movie = await MovieDBEntity.findOne({ where: { id: movieId } });
    return movie ? new Movie(movie.id, movie.title, movie.description, movie.category) : null;
  }

  async findPaginated({ cursor, limit }: IPaginationParams): Promise<TPaginationResponse<Movie>> {
    // Increasing the number of retrieved registers to check if there is a next page
    const limitWithNextPageFirstElement = limit + 1;

    const query = MovieDBEntity.createQueryBuilder('movie')
      .where('movie.deletedAt IS NULL')
      .orderBy('movie.createdAt', 'DESC')
      .take(limitWithNextPageFirstElement);

    if (cursor) {
      query.andWhere('movie.createdAt < :cursor', { cursor: new Date(Number(cursor)) });
    }

    const movies = await query.getMany();
    const moviesToReturn = movies.slice(0, -1);

    const hasNext = movies.length === limitWithNextPageFirstElement;

    if (hasNext)
      return {
        data: moviesToReturn.map((movie) => new Movie(movie.id, movie.title, movie.description, movie.category)),
        hasNext: true,
        nextCursor: encodeCursor(moviesToReturn[moviesToReturn.length - 1].createdAt.valueOf().toString()),
      };

    return {
      data: movies.map((movie) => new Movie(movie.id, movie.title, movie.description, movie.category)),
      hasNext: false,
      nextCursor: undefined,
    };
  }

  async deleteById(movieId: string): Promise<void> {
    await MovieDBEntity.update({ id: movieId }, { deletedAt: new Date() });
  }
}
