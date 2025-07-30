export interface ITokenValidator {
  validate(token: string): { userId: string } | null;
}
