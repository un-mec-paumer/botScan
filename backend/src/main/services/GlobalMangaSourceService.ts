import { PrismaClient } from '@prisma/client';
import { ModelGlobalMangaSource } from '@models/GlobalMangaSource';
import { GlobalMangaSourceServiceError } from '@errors/GlobalMangaSourceServiceError';

export class GlobalMangaSourceService {
    constructor(protected readonly prisma: PrismaClient) {}

    async getGlobalMangaSources(): Promise<ModelGlobalMangaSource[]> {
        const globalMangaSources = await this.prisma.globalMangaSource.findMany();
        return globalMangaSources.map((globalMangaSource) => new ModelGlobalMangaSource(globalMangaSource));
    }

    async updateUrl(id: number, url: string): Promise<ModelGlobalMangaSource> {
        const globalMangaSource = await this.prisma.globalMangaSource.update({
            data: {
                url: url,
            },
            where: {
                id: id,
            },
        });

        if (!globalMangaSource) {
            throw new GlobalMangaSourceServiceError('Manga not found.', 404);
        }

        return new ModelGlobalMangaSource(globalMangaSource);
    }
}
