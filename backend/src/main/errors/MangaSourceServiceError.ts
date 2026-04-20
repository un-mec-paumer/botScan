export class MangaSourceServiceError extends Error {
    public readonly statusCode: number;

    constructor(message: string, statusCode = 500) {
        super(message);
        this.name = 'MangaSourceServiceError';
        this.statusCode = statusCode;
    }
}
