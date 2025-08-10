export class Seat {
  constructor(
    public id: string,
    public screeningId: string,
    public rowLabel: string,
    public seatNumber: string,
    public status: string,
  ) {}
}
