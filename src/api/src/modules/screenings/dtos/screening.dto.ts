import { Screening } from '../database/screening.entity';

export type ScreeningDTO = {
  id: string;
  movie: {
    id: string;
    title: string;
    description: string;
    category: string;
  };
  theater: {
    id: string;
    name: string;
  };
  startTime: Date;
  endTime: Date;
};

export const mapScreeningToDTO = (screening: Screening): ScreeningDTO => ({
  id: screening.id,
  movie: {
    id: screening.movie.id,
    title: screening.movie.title,
    description: screening.movie.description,
    category: screening.movie.category,
  },
  theater: {
    id: screening.theater.id,
    name: screening.theater.name,
  },
  startTime: screening.startTime,
  endTime: screening.endTime,
});
