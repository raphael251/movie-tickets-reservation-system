export class CancelingOperationOutOfRange extends Error {
  constructor() {
    super('Reservations can only be canceled 48 hours before the screening start time');
    this.name = this.constructor.name;
  }
}
