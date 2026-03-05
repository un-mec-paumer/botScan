export class WorkServiceError extends Error {
  public readonly statusCode: number;

  constructor(message: string, statusCode = 500) {
    super(message);
    this.name = 'WorkServiceError';
    this.statusCode = statusCode;
  }
}
