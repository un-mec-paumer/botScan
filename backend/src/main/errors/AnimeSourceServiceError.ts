export class AnimeSourceServiceError extends Error {
    public readonly statusCode: number;

    constructor(message: string, statusCode = 500) {
        super(message);
        this.name = 'AnimeSourceServiceError';
        this.statusCode = statusCode;
    }
}
