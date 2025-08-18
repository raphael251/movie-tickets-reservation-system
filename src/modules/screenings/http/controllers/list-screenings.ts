import { IHttpControllerV2, THttpResponse } from '../../../shared/interfaces/http/controller.ts';
import { Screening } from '../../entities/screening.ts';
import { IScreeningRepository } from '../../repositories/interfaces/screening.repository';

export class ListScreeningsController implements IHttpControllerV2<Screening[]> {
  constructor(private repository: IScreeningRepository) {}

  async handle(): Promise<THttpResponse<Screening[]>> {
    const screenings = await this.repository.findAll();

    return {
      status: 200,
      data: screenings,
    };
  }
}
