export class AuthGuardError extends Error {
  public readonly statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.name = 'AuthGuardError';
    this.statusCode = statusCode;
  }
}
