export class AlreadyScheduledMovieError extends Error {
  constructor() {
    super('Movie is already scheduled in the specified time slot');
    this.name = this.constructor.name;
  }
}
