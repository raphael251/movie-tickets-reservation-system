export class InvalidScreeningIdError extends Error {
  constructor() {
    super('Invalid screening ID.');
    this.name = this.constructor.name;
  }
}
