export class AlertServiceError extends Error {
    public readonly statusCode: number;

    constructor(message: string, statusCode = 500) {
        super(message);
        this.name = 'AlertServiceError';
        this.statusCode = statusCode;
    }
}
