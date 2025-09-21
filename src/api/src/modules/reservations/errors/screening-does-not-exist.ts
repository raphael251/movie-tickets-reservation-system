export class ScreeningDoesNotExistError extends Error {
  constructor() {
    super('Screening does not exist');
    this.name = this.constructor.name;
  }
}
