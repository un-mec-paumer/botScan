export class MangaServiceError extends Error {
    public readonly statusCode: number;

    constructor(message: string, statusCode = 500) {
        super(message);
        this.name = 'MangaServiceError';
        this.statusCode = statusCode;
    }
}
