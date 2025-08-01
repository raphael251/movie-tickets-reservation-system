export class SeatAlreadyReservedError extends Error {
  constructor() {
    super('Seat is already reserved for this movie.');
    this.name = this.constructor.name;
  }
}
