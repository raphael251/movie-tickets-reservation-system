export class InputValidationError extends Error {
  errors: string[];

  constructor(errors: string[]) {
    super('Invalid input');
    this.errors = errors;
    this.name = this.constructor.name;
  }
}
