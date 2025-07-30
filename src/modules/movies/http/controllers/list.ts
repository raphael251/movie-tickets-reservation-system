import { IHttpController } from '../../../shared/interfaces/http/controller';
import { IMovieRepository } from '../../repositories/interfaces/movie.repository';
import { Request, Response } from 'express';

export class ListMoviesController implements IHttpController {
  constructor(private movieRepository: IMovieRepository) {}

  async handle(request: Request, response: Response): Promise<void> {
    const movies = await this.movieRepository.findAll();

    response.status(200).json({ movies });
  }
}
