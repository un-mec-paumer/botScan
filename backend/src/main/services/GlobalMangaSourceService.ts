import { PrismaClient } from '@prisma/client';
import { ModelGlobalMangaSource } from '@models/GlobalMangaSource';

export class GlobalMangaSourceService {
    constructor(protected readonly prisma: PrismaClient) {}

    async getGlobalMangaSources(): Promise<ModelGlobalMangaSource[]> {
        const globalMangaSources = await this.prisma.globalMangaSource.findMany();
        return globalMangaSources.map((globalMangaSource) => new ModelGlobalMangaSource(globalMangaSource));
    }
}
