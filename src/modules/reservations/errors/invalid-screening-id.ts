export class InvalidScreeningSeatIdError extends Error {
  constructor() {
    super('Invalid screening seat ID.');
    this.name = this.constructor.name;
  }
}
