import { PrismaClient } from '@prisma/client';
import { AlertServiceError } from '../errors/AlertServiceError';

export class AlertService {
    constructor(private readonly prisma: PrismaClient) {}

    async getAlert(userId: string, workId: number) {
        const alert = await this.prisma.alert.findUnique({
            where: {
                userId_workId: {
                    userId,
                    workId,
                },
            },
            include: {
                Work: true,
                User: true,
            },
        });

        if (!alert) {
            throw new AlertServiceError('Alert not found.', 404);
        }

        return alert;
    }

    async addAlert(
        userId: string,
        workId: number,
        mangaAlert: boolean = false,
        animeAlert: boolean = false
    ) {
        const alert = await this.prisma.alert.create({
            data: {
                userId,
                workId,
                mangaAlert,
                animeAlert,
            },
        });

        if (!alert) {
            throw new AlertServiceError('Alert already exists.', 409);
        }

        return alert;
    }

    async updateAlert(
        userId: string,
        workId: number,
        mangaAlert: boolean | null = null,
        animeAlert: boolean | null = null
    ) {
        const alert = await this.getAlert(userId, workId);

        if (!alert) {
            throw new AlertServiceError("Alert doesn't exists.", 404);
        }

        return await this.prisma.alert.update({
            data: {
                userId,
                workId,
                mangaAlert: mangaAlert ?? alert.mangaAlert,
                animeAlert: animeAlert ?? alert.animeAlert,
            },
        });
    }

    async deleteAlert(userId: string, workId: number) {
        const alert = await this.prisma.alert.delete({
            where: {
                userId_workId: {
                    userId,
                    workId,
                },
            },
        });

        if (!alert) {
            throw new AlertServiceError('Alert already exists.', 409);
        }

        return alert;
    }

    /**
     * Récupère la liste d'alerte d'un utilisateur.
     * @param id L'ID de l'utilisateur.
     */
    async getAlertsByUserId(userId: string) {
        return await this.prisma.alert.findMany({
            where: { userId: userId },
            include: {
                Work: true,
                User: true,
            },
        });
    }

    /**
     * Récupère la liste d'alerte d'une oeuvre.
     * @param id L'ID de l'utilisateur.
     */
    async getAlertsByWorkId(workId: number) {
        return await this.prisma.alert.findMany({
            where: { workId: workId },
            include: {
                Work: true,
                User: true,
            },
        });
    }
}
