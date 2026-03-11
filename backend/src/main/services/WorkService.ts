import { PrismaClient } from '@prisma/client';
import { WorkServiceError } from '../errors/WorkServiceError';

export abstract class WorkService {
    protected selection: object = {
        id: true,
        name: true,
        synopsis: true,
        imgUrl: true,
    };

    constructor(protected readonly prisma: PrismaClient) {}

    /**
     * Récupère une oeuvre.
     * @param id L'id de l'oeuvre.
     */
    protected async getWorkById(id: number) {
        const work = await this.prisma.work.findUnique({
            select: this.selection,
            where: { id },
        });

        if (!work) {
            throw new WorkServiceError('Work not found.', 404);
        }

        return work;
    }

    /**
     * Récupère une oeuvre.
     * @param id L'id de l'oeuvre.
     */
    protected async getWorkByName(name: string) {
        const manga = await this.prisma.work.findFirst({
            select: this.selection,
            where: {
                name: {
                    contains: name,
                },
            },
        });

        if (!manga) {
            throw new WorkServiceError('Work not found.', 404);
        }

        return manga;
    }

    /**
     * Récupère les oeuvres
     */
    protected async getWorks() {
        return await this.prisma.work.findMany({ select: this.selection });
    }

    /**
     * Récupère un manga.
     * @param id L'ID de l'manga.
     */
    // protected async addWork(name: string, synopsis: string | null, imgUrl: string | null) {
    //   const manga = await this.prisma.work.create({
    //     data: {
    //       name,
    //       synopsis,
    //       imgUrl
    //     }
    //   });

    //   if (!manga) {
    //     throw new WorkServiceError('Manga already exists.', 409);
    //   }

    //   return manga;
    // }
}
