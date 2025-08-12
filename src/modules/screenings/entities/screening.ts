export class Screening {
  constructor(
    public id: string,
    public movieId: string,
    public theaterId: string,
    public startTime: Date,
    public endTime: Date,
  ) {}
}
