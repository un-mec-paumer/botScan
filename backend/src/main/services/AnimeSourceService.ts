import { PrismaClient } from '@prisma/client';
import { AnimeSourceServiceError } from '@errors/AnimeSourceServiceError';
import { ModelAnimeSource } from '@models/AnimeSource';
import { ModelGlobalAnimeSource } from '@models/GlobalAnimeSource';
import { ModelAnime } from '@models/Anime';

export class AnimeSourceService {
    constructor(private readonly prisma: PrismaClient) {}

    async getSource(globalAnimeSourceId: number, animeId: number): Promise<ModelAnimeSource> {
        const source = await this.prisma.animeSource.findUnique({
            where: {
                globalAnimeSourceId_animeId: {
                    globalAnimeSourceId,
                    animeId,
                },
            },
            include: {
                Anime: true,
                GlobalAnimeSource: true,
            },
        });

        if (!source) {
            throw new AnimeSourceServiceError('Source not found.', 404);
        }

        return new ModelAnimeSource(source, new ModelAnime(source.Anime), new ModelGlobalAnimeSource(source.GlobalAnimeSource));
    }

    async addSource(link: string, globalAnimeSourceId: number, animeId: number): Promise<ModelAnimeSource> {
        const source = await this.prisma.animeSource.create({
            data: {
                link,
                globalAnimeSourceId,
                animeId
            },
            include: {
                Anime: true,
                GlobalAnimeSource: true,
            },
        });

        if (!source) {
            throw new AnimeSourceServiceError('Source already exists.', 409);
        }

        return new ModelAnimeSource(source, new ModelAnime(source.Anime), new ModelGlobalAnimeSource(source.GlobalAnimeSource));
    }

    async updateLink(link: string, globalAnimeSourceId: number, animeId: number): Promise<ModelAnimeSource> {
        const source = await this.prisma.animeSource.update({
            data: {
                link,
            },
            where: {
                globalAnimeSourceId_animeId: {
                    globalAnimeSourceId,
                    animeId,
                },
            },
            include: {
                Anime: true,
                GlobalAnimeSource: true,
            },
        });

        if (!source) {
            throw new AnimeSourceServiceError('Source already exists.', 409);
        }

        return new ModelAnimeSource(source, new ModelAnime(source.Anime), new ModelGlobalAnimeSource(source.GlobalAnimeSource));
    }

    async deleteSource(globalAnimeSourceId: number, animeId: number): Promise<boolean> {
        const source = await this.prisma.animeSource.delete({
            where: {
                globalAnimeSourceId_animeId: {
                    globalAnimeSourceId,
                    animeId,
                },
            },
        });

        if (!source) {
            throw new AnimeSourceServiceError('Source already exists.', 409);
        }

        return true;
    }

    async getSourcesByGlobalAnimeSourceId(globalAnimeSourceId: number): Promise<ModelAnimeSource[]> {
        const sources = await this.prisma.animeSource.findMany({
            where: { globalAnimeSourceId: globalAnimeSourceId },
            include: {
                Anime: true,
                GlobalAnimeSource: true,
            },
        });

        return sources.map(source => new ModelAnimeSource(source, new ModelAnime(source.Anime), new ModelGlobalAnimeSource(source.GlobalAnimeSource)));
    }

    async getSourcesByAnimeId(animeId: number): Promise<ModelAnimeSource[]> {
        const sources = await this.prisma.animeSource.findMany({
            where: { animeId },
            include: {
                Anime: true,
                GlobalAnimeSource: true,
            },
        });

        return sources.map(source => new ModelAnimeSource(source, new ModelAnime(source.Anime), new ModelGlobalAnimeSource(source.GlobalAnimeSource)));
    }
}
