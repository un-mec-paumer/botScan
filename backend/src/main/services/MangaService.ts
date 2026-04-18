import { Manga, PrismaClient } from '@prisma/client';
import { MangaServiceError } from '@errors/MangaServiceError';
import { ModelManga } from '@models/Manga';
import { AddMangaDtoType } from '@dtos/mangas/AddMangaDto';

export class MangaService {
    constructor(protected readonly prisma: PrismaClient) {}

    /**
     * Récupère un manga.
     * @param id L'id du manga.
     */
    async getMangaById(id: number): Promise<ModelManga> {
        const manga = await this.prisma.manga.findUnique({
            where: { id },
        }) as Manga;

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
        const manga = await this.prisma.manga.findFirst({
            where: {
                name: {
                    contains: name,
                },
            },
        }) as Manga;

        if (!manga) {
            throw new MangaServiceError('Manga not found.', 404);
        }

        return new ModelManga(manga);
    }

    /**
     * Récupère les mangas
     */
    async getMangas(): Promise<ModelManga[]> {
        const mangas = await this.prisma.manga.findMany();
        return mangas.map((manga) => new ModelManga(manga));
    }

    /**
     * Récupère un manga.
     * @param id L'id du manga.
     */
    async addManga(data: AddMangaDtoType): Promise<ModelManga> {
        const manga = await this.prisma.manga.create({
            data: data,
        });

        if (!manga) {
            throw new MangaServiceError('Manga already exists.', 409);
        }

        return new ModelManga(manga);
    }

    async updateChapter(id: number, chapter: string): Promise<ModelManga> {
        const manga = await this.prisma.manga.update({
            data: {
                chapter: chapter,
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
