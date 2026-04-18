import { PrismaClient } from '@prisma/client';
import { AnimeAlertServiceError } from '@errors/AnimeAlertServiceError';
import { ModelAnimeAlert } from '@models/AnimeAlert';
import { ModelUser } from '@models/User';
import { ModelAnime } from '@models/Anime';

export class AnimeAlertService {
    constructor(private readonly prisma: PrismaClient) { }

    async getAlert(userId: string, animeId: number): Promise<ModelAnimeAlert> {
        const alert = await this.prisma.animeAlert.findUnique({
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

        return new ModelAnimeAlert(new ModelUser(alert.User), new ModelAnime(alert.Anime));
    }

    async addAlert(userId: string, animeId: number): Promise<ModelAnimeAlert> {
        const alert = await this.prisma.animeAlert.create({
            data: {
                userId,
                animeId
            },
            include: {
                Anime: true,
                User: true,
            },
        });

        if (!alert) {
            throw new AnimeAlertServiceError('Alert already exists.', 409);
        }

        return new ModelAnimeAlert(new ModelUser(alert.User), new ModelAnime(alert.Anime));
    }

    async deleteAlert(userId: string, animeId: number): Promise<boolean> {
        const alert = await this.prisma.animeAlert.delete({
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

        return true;
    }

    /**
     * Récupère la liste d'alerte d'un utilisateur.
     * @param id L'ID de l'utilisateur.
     */
    async getAlertsByUserId(userId: string): Promise<ModelAnimeAlert[]> {
        const alerts = await this.prisma.animeAlert.findMany({
            where: { userId: userId },
            include: {
                Anime: true,
                User: true,
            },
        });

        return alerts.map(alert => new ModelAnimeAlert(new ModelUser(alert.User), new ModelAnime(alert.Anime)));
    }

    /**
     * Récupère la liste d'alerte d'une oeuvre.
     * @param id L'ID de l'utilisateur.
     */
    async getAlertsByAnimeId(animeId: number): Promise<ModelAnimeAlert[]> {
        const alerts = await this.prisma.animeAlert.findMany({
            where: { animeId: animeId },
            include: {
                Anime: true,
                User: true,
            },
        });

        return alerts.map(alert => new ModelAnimeAlert(new ModelUser(alert.User), new ModelAnime(alert.Anime)));
    }
}
