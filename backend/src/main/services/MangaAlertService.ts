import { MangaAlert, PrismaClient } from '@prisma/client';
import { MangaAlertServiceError } from '@errors/MangaAlertServiceError';

export class MangaAlertService {
    constructor(private readonly prisma: PrismaClient) {}

    async getAlert(userId: string, mangaId: number): Promise<MangaAlert> {
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

        return alert;
    }

    async addAlert(userId: string, mangaId: number): Promise<MangaAlert> {
        const alert = await this.prisma.mangaAlert.create({
            data: {
                userId,
                mangaId
            },
        });

        if (!alert) {
            throw new MangaAlertServiceError('Alert already exists.', 409);
        }

        return alert;
    }

    async deleteAlert(userId: string, mangaId: number): Promise<MangaAlert> {
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

        return alert;
    }

    /**
     * Récupère la liste d'alerte d'un utilisateur.
     * @param id L'ID de l'utilisateur.
     */
    async getAlertsByUserId(userId: string): Promise<MangaAlert[]> {
        return await this.prisma.mangaAlert.findMany({
            where: { userId: userId },
            include: {
                Manga: true,
                User: true,
            },
        });
    }

    /**
     * Récupère la liste d'alerte d'une oeuvre.
     * @param id L'ID de l'utilisateur.
     */
    async getAlertsByMangaId(mangaId: number): Promise<MangaAlert[]> {
        return await this.prisma.mangaAlert.findMany({
            where: { mangaId: mangaId },
            include: {
                Manga: true,
                User: true,
            },
        });
    }
}
