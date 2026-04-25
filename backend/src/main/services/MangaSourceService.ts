import { PrismaClient } from '@prisma/client';
import { MangaSourceServiceError } from '@errors/MangaSourceServiceError';
import { ModelMangaSource } from '@models/MangaSource';
import { ModelGlobalMangaSource } from '@models/GlobalMangaSource';
import { ModelManga } from '@models/Manga';

export class MangaSourceService {
    constructor(private readonly prisma: PrismaClient) {}

    async getSource(globalMangaSourceId: number, mangaId: number): Promise<ModelMangaSource> {
        const source = await this.prisma.mangaSource.findUnique({
            where: {
                globalMangaSourceId_mangaId: {
                    globalMangaSourceId,
                    mangaId,
                },
            },
            include: {
                Manga: true,
                GlobalMangaSource: true,
            },
        });

        if (!source) {
            throw new MangaSourceServiceError('Source not found.', 404);
        }

        return new ModelMangaSource(source, new ModelManga(source.Manga), new ModelGlobalMangaSource(source.GlobalMangaSource));
    }

    async addSource(link: string, globalMangaSourceId: number, mangaId: number): Promise<ModelMangaSource> {
        const source = await this.prisma.mangaSource.create({
            data: {
                link,
                globalMangaSourceId,
                mangaId
            },
            include: {
                Manga: true,
                GlobalMangaSource: true,
            },
        });

        if (!source) {
            throw new MangaSourceServiceError('Source already exists.', 409);
        }

        return new ModelMangaSource(source, new ModelManga(source.Manga), new ModelGlobalMangaSource(source.GlobalMangaSource));
    }

    async updateLink(link: string, globalMangaSourceId: number, mangaId: number): Promise<ModelMangaSource> {
        const source = await this.prisma.mangaSource.update({
            data: {
                link,
            },
            where: {
                globalMangaSourceId_mangaId: {
                    globalMangaSourceId,
                    mangaId,
                },
            },
            include: {
                Manga: true,
                GlobalMangaSource: true,
            },
        });

        if (!source) {
            throw new MangaSourceServiceError('Source already exists.', 409);
        }

        return new ModelMangaSource(source, new ModelManga(source.Manga), new ModelGlobalMangaSource(source.GlobalMangaSource));
    }

    async deleteSource(globalMangaSourceId: number, mangaId: number): Promise<boolean> {
        const source = await this.prisma.mangaSource.delete({
            where: {
                globalMangaSourceId_mangaId: {
                    globalMangaSourceId,
                    mangaId,
                },
            },
        });

        if (!source) {
            throw new MangaSourceServiceError('Source already exists.', 409);
        }

        return true;
    }

    async getSourcesByGlobalMangaSourceId(globalMangaSourceId: number): Promise<ModelMangaSource[]> {
        const sources = await this.prisma.mangaSource.findMany({
            where: { globalMangaSourceId: globalMangaSourceId },
            include: {
                Manga: true,
                GlobalMangaSource: true,
            },
        });

        return sources.map(source => new ModelMangaSource(source, new ModelManga(source.Manga), new ModelGlobalMangaSource(source.GlobalMangaSource)));
    }

    async getSourcesByMangaId(mangaId: number): Promise<ModelMangaSource[]> {
        const sources = await this.prisma.mangaSource.findMany({
            where: { mangaId },
            include: {
                Manga: true,
                GlobalMangaSource: true,
            },
        });

        return sources.map(source => new ModelMangaSource(source, new ModelManga(source.Manga), new ModelGlobalMangaSource(source.GlobalMangaSource)));
    }
}
