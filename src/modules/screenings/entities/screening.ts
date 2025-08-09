export class Screening {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public category: string,
    public room: string,
    public startTime: Date,
    public endTime: Date,
  ) {}
}
