export class AnimeAlertServiceError extends Error {
    public readonly statusCode: number;

    constructor(message: string, statusCode = 500) {
        super(message);
        this.name = 'AnimeAlertServiceError';
        this.statusCode = statusCode;
    }
}
