export class EmailAlreadyRegisteredError extends Error {
  constructor() {
    super('E-mail already registered');
    this.name = this.constructor.name;
  }
}
