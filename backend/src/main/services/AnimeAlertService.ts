import { PrismaClient } from '@prisma/client';
import { AnimeAlertServiceError } from '@errors/AnimeAlertServiceError';

export class AnimeAlertService {
    constructor(private readonly prisma: PrismaClient) {}

    async getAlert(userId: string, animeId: number) {
        const alert = await this.prisma.AnimeAlert.findUnique({
            where: {
                userId_animeId: {
                    userId,
                    animeId,
                },
            },
            include: {
                Anime: true,
                User: true,
            },
        });

        if (!alert) {
            throw new AnimeAlertServiceError('Alert not found.', 404);
        }

        return alert;
    }

    async addAlert(
        userId: string,
        animeId: number
    ) {
        const alert = await this.prisma.AnimeAlert.create({
            data: {
                userId,
                animeId
            },
        });

        if (!alert) {
            throw new AnimeAlertServiceError('Alert already exists.', 409);
        }

        return alert;
    }

    async deleteAlert(userId: string, animeId: number) {
        const alert = await this.prisma.AnimeAlert.delete({
            where: {
                userId_animeId: {
                    userId,
                    animeId,
                },
            },
        });

        if (!alert) {
            throw new AnimeAlertServiceError('Alert already exists.', 409);
        }

        return alert;
    }

    /**
     * Récupère la liste d'alerte d'un utilisateur.
     * @param id L'ID de l'utilisateur.
     */
    async getAlertsByUserId(userId: string) {
        return await this.prisma.AnimeAlert.findMany({
            where: { userId: userId },
            include: {
                Anime: true,
                User: true,
            },
        });
    }

    /**
     * Récupère la liste d'alerte d'une oeuvre.
     * @param id L'ID de l'utilisateur.
     */
    async getAlertsByAnimeId(animeId: number) {
        return await this.prisma.AnimeAlert.findMany({
            where: { animeId: animeId },
            include: {
                Anime: true,
                User: true,
            },
        });
    }
}
