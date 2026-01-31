export class AuthGuardError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.name = 'AuthGuardError';
    this.statusCode = statusCode;
  }
}
