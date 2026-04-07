export class MangaAlertServiceError extends Error {
    public readonly statusCode: number;

    constructor(message: string, statusCode = 500) {
        super(message);
        this.name = 'MangaAlertServiceError';
        this.statusCode = statusCode;
    }
}
