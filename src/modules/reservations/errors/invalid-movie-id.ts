export class InvalidMovieIdError extends Error {
  constructor() {
    super('Invalid movie ID.');
    this.name = this.constructor.name;
  }
}
