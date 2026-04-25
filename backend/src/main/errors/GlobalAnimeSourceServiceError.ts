export class GlobalAnimeSourceServiceError extends Error {
    public readonly statusCode: number;

    constructor(message: string, statusCode = 500) {
        super(message);
        this.name = 'GlobalAnimeSourceServiceError';
        this.statusCode = statusCode;
    }
}
