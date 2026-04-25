import { PrismaClient } from '@prisma/client';
import { ModelGlobalAnimeSource } from '@models/GlobalAnimeSource';
import { GlobalAnimeSourceServiceError } from '@errors/GlobalAnimeSourceServiceError';

export class GlobalAnimeSourceService {
    constructor(protected readonly prisma: PrismaClient) {}

    async getGlobalAnimeSources(): Promise<ModelGlobalAnimeSource[]> {
        const globalAnimeSources = await this.prisma.globalAnimeSource.findMany();
        return globalAnimeSources.map((globalAnimeSource) => new ModelGlobalAnimeSource(globalAnimeSource));
    }

    async updateUrl(id: number, url: string): Promise<ModelGlobalAnimeSource> {
        const globalAnimeSource = await this.prisma.globalAnimeSource.update({
            data: {
                url: url,
            },
            where: {
                id: id,
            },
        });

        if (!globalAnimeSource) {
            throw new GlobalAnimeSourceServiceError('Anime not found.', 404);
        }

        return new ModelGlobalAnimeSource(globalAnimeSource);
    }
}
