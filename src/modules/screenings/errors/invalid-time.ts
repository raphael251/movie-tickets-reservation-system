export class InvalidTimeError extends Error {
  constructor() {
    super('Start time must be before end time');
    this.name = this.constructor.name;
  }
}
