import { PrismaClient } from '@prisma/client';
import { MangaServiceError } from '@errors/MangaServiceError';
import { ModelManga } from '@models/manga';
import { AddMangaDtoType } from '@dtos/mangas/AddMangaDto';
import { DisplayMangaDtoType } from '@dtos/mangas/DisplayMangaDto';

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
        const manga = await this.prisma.manga.findUnique({
            select: this.selection,
            where: { id },
        }) as DisplayMangaDtoType;

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
            select: this.selection,
            where: {
                name: {
                    contains: name,
                },
            },
        }) as DisplayMangaDtoType;

        if (!manga) {
            throw new MangaServiceError('Manga not found.', 404);
        }

        return new ModelManga(manga);
    }

    /**
     * Récupère les mangas
     */
    async getMangas(): Promise<ModelManga[]> {
        const mangas = await this.prisma.manga.findMany({ select: this.selection }) as DisplayMangaDtoType[];
        return mangas.map((manga) => new ModelManga(manga));
    }

    /**
     * Récupère un manga.
     * @param id L'id du manga.
     */
    async addManga(data: AddMangaDtoType) {
        const manga = await this.prisma.manga.create({
            data: data,
        });

        if (!manga) {
            throw new MangaServiceError('Manga already exists.', 409);
        }

        return manga;
    }

    async updateChapter(id: number, chapter: string): Promise<ModelManga> {
        const manga = await this.prisma.manga.update({
            data: {
                chapter: chapter,
            },
            where: {
                id: id,
            },
        }) as DisplayMangaDtoType;

        if (!manga) {
            throw new MangaServiceError('Manga not found.', 404);
        }

        return new ModelManga(manga);
    }
}
