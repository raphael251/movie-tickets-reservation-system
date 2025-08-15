export class TheaterDoesNotExistError extends Error {
  constructor() {
    super('Theater does not exist');
    this.name = this.constructor.name;
  }
}
