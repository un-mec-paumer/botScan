export class GlobalMangaSourceServiceError extends Error {
    public readonly statusCode: number;

    constructor(message: string, statusCode = 500) {
        super(message);
        this.name = 'GlobalMangaSourceServiceError';
        this.statusCode = statusCode;
    }
}
