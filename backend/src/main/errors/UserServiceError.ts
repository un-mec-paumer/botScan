export class UserServiceError extends Error {
  public readonly statusCode: number;

  constructor(message: string, statusCode = 500) {
    super(message);
    this.name = 'UserServiceError';
    this.statusCode = statusCode;
  }
}
