import { PrismaClient } from '@prisma/client';
import { MangaServiceError } from '@errors/MangaServiceError';
import { ModelManga } from '@models/manga';

export class MangaService {
    private readonly selection: object = {
        id: true,
        name: true,
        synopsis: true,
        imgUrl: true,
        chapter: true,
        mangaSources: {
            select: {
                mangaSource: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        },
    };

    constructor(protected readonly prisma: PrismaClient) {}

    /**
     * Récupère un manga.
     * @param id L'id du manga.
     */
    async getMangaById(id: number): Promise<ModelManga> {
        const manga = await this.prisma.Manga.findUnique({
            select: this.selection,
            where: { id },
        });

        if (!manga) {
            throw new MangaServiceError('Manga not found.', 404);
        }

        return new ModelManga(manga);
    }

    /**
     * Récupère un manga.
     * @param id L'id du manga.
     */
    async getMangaByName(name: string): Promise<ModelManga> {
        const manga = await this.prisma.Manga.findFirst({
            select: this.selection,
            where: {
                name: {
                    contains: name,
                },
            },
        });

        if (!manga) {
            throw new MangaServiceError('Manga not found.', 404);
        }

        return new ModelManga(manga);
    }

    /**
     * Récupère les mangas
     */
    async getMangas(): Promise<ModelManga[]> {
        const mangas = await this.prisma.Manga.findMany({ select: this.selection });
        const mangasWithChapter = mangas.map(new ModelManga) as ModelManga[];
        return mangasWithChapter;
    }

    /**
     * Récupère un manga.
     * @param id L'id du manga.
     */
    async addManga() {
        const manga = await this.prisma.Manga.create({
        });

        if (!manga) {
        throw new MangaServiceError('Manga already exists.', 409);
        }

        return manga;
    }

    async updateChapter(id: number, chapter: string): Promise<ModelManga> {
        const manga = await this.prisma.Manga.update({
            data: {
                mangaChapter: chapter,
            },
            where: {
                id: id,
            },
        });

        if (!manga) {
            throw new MangaServiceError('Manga not found.', 404);
        }

        return new ModelManga(manga);
    }
}
