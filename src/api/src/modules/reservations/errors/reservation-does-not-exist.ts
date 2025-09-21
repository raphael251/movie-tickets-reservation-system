export class ReservationDoesNotExistError extends Error {
  constructor() {
    super('Reservation does not exist');
    this.name = this.constructor.name;
  }
}
