export class Reservation {
  constructor(
    public id: string,
    public userId: string,
    public movieId: string,
    public seatCode: string,
    public expiresAt: Date,
  ) {}
}
