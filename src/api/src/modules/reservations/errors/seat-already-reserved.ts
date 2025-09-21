export class SeatAlreadyReservedError extends Error {
  constructor() {
    super('Seat is already reserved for this screening.');
    this.name = this.constructor.name;
  }
}
