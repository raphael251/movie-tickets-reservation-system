export class Reservation {
  constructor(
    public id: string,
    public userId: string,
    public screeningId: string,
    public seatCode: string,
    public expiresAt: Date,
  ) {}
}
