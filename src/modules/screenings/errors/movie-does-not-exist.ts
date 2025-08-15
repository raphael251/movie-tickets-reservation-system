export class MovieDoesNotExistError extends Error {
  constructor() {
    super('Movie does not exist');
    this.name = this.constructor.name;
  }
}
