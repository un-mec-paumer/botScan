import { PrismaClient } from '@prisma/client';
import { WorkService } from './WorkService';
import { MangaServiceError } from '@errors/MangaServiceError';
import { DisplayMangaDtoClass } from '@dtos/mangas/DisplayMangaDto';

export class MangaService extends WorkService {
    constructor(protected readonly prisma: PrismaClient) {
        super(prisma);

        this.selection = {
            ...this.selection,
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
            mangaChapter: true,
        };
    }

    /**
     * Récupère un manga.
     * @param id L'id du manga.
     */
    async getMangaById(id: number): Promise<DisplayMangaDtoClass> {
        const manga = await this.getWorkById(id);

        if (!manga) {
            throw new MangaServiceError('Manga not found.', 404);
        }
        return this.getMangasWithChapter(manga);
    }

    /**
     * Récupère un manga.
     * @param id L'id du manga.
     */
    async getMangaByName(name: string): Promise<DisplayMangaDtoClass> {
        const manga = await this.getWorkByName(name);

        if (!manga) {
            throw new MangaServiceError('Manga not found.', 404);
        }
        return this.getMangasWithChapter(manga);
    }

    /**
     * Récupère les mangas
     */
    async getMangas(): Promise<DisplayMangaDtoClass[]> {
        const mangas = await this.getWorks();
        const mangasWithChapter = mangas.map(this.getMangasWithChapter.bind(this));
        return mangasWithChapter;
    }

    /**
     * Récupère un manga.
     * @param id L'id du manga.
     */
    /*async addManga() {
    const manga = await this.prisma.manga.create({
    });

    if (!manga) {
      throw new MangaServiceError('Manga already exists.', 409);
    }

    return manga;
  }*/

    async updateChapter(id: number, chapter: string): Promise<DisplayMangaDtoClass> {
        const manga = await this.prisma.work.update({
            data: {
                mangaChapter: chapter,
            },
            where: {
                id: id,
            },
        });
        return this.getMangasWithChapter(manga);
    }

    
    
    private getMangasWithChapter(manga: any): DisplayMangaDtoClass {
        return new DisplayMangaDtoClass({
            ...manga,
            chapter: manga.mangaChapter,
        });
    }
}
