export class AnimeServiceError extends Error {
    public readonly statusCode: number;

    constructor(message: string, statusCode = 500) {
        super(message);
        this.name = 'AnimeServiceError';
        this.statusCode = statusCode;
    }
}
