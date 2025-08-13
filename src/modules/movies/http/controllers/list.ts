import { Request, Response } from 'express';
import { IMovieRepository } from '../../repositories/interfaces/movie.repository';
import { IHttpController } from '../../../shared/interfaces/http/controller';

export class ListMoviesController implements IHttpController {
  constructor(private repository: IMovieRepository) {}
  async handle(request: Request, response: Response): Promise<void> {
    try {
      const movies = await this.repository.findAll();

      response.status(200).json({ movies });
    } catch (error) {
      console.error('Error during movie listing:', error);
      response.status(500).send('Internal Server Error');
    }
  }
}
