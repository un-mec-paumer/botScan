import { PrismaClient } from '@prisma/client';
import { MangaAlertServiceError } from '@errors/MangaAlertServiceError';
import { ModelMangaAlert } from '@models/MangaAlert';
import { ModelUser } from '@models/User';
import { ModelManga } from '@models/Manga';

export class MangaAlertService {
    constructor(private readonly prisma: PrismaClient) {}

    async getAlert(userId: string, mangaId: number): Promise<ModelMangaAlert> {
        const alert = await this.prisma.mangaAlert.findUnique({
            where: {
                userId_mangaId: {
                    userId,
                    mangaId,
                },
            },
            include: {
                Manga: true,
                User: true,
            },
        });

        if (!alert) {
            throw new MangaAlertServiceError('Alert not found.', 404);
        }

        return new ModelMangaAlert(new ModelUser(alert.User), new ModelManga(alert.Manga));
    }

    async addAlert(userId: string, mangaId: number): Promise<ModelMangaAlert> {
        const alert = await this.prisma.mangaAlert.create({
            data: {
                userId,
                mangaId
            },
            include: {
                Manga: true,
                User: true,
            },
        });

        if (!alert) {
            throw new MangaAlertServiceError('Alert already exists.', 409);
        }

        return new ModelMangaAlert(new ModelUser(alert.User), new ModelManga(alert.Manga));
    }

    async deleteAlert(userId: string, mangaId: number): Promise<boolean> {
        const alert = await this.prisma.mangaAlert.delete({
            where: {
                userId_mangaId: {
                    userId,
                    mangaId,
                },
            },
        });

        if (!alert) {
            throw new MangaAlertServiceError('Alert already exists.', 409);
        }

        return true;
    }

    /**
     * Récupère la liste d'alerte d'un utilisateur.
     * @param id L'ID de l'utilisateur.
     */
    async getAlertsByUserId(userId: string): Promise<ModelMangaAlert[]> {
        const alerts = await this.prisma.mangaAlert.findMany({
            where: { userId: userId },
            include: {
                Manga: true,
                User: true,
            },
        });

        return alerts.map(alert => new ModelMangaAlert(new ModelUser(alert.User), new ModelManga(alert.Manga)));
    }

    /**
     * Récupère la liste d'alerte d'une oeuvre.
     * @param id L'ID de l'utilisateur.
     */
    async getAlertsByMangaId(mangaId: number): Promise<ModelMangaAlert[]> {
        const alerts = await this.prisma.mangaAlert.findMany({
            where: { mangaId: mangaId },
            include: {
                Manga: true,
                User: true,
            },
        });

        return alerts.map(alert => new ModelMangaAlert(new ModelUser(alert.User), new ModelManga(alert.Manga)));
    }
}
