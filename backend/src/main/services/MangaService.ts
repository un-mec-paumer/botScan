import { PrismaClient } from '@prisma/client';
import { WorkService } from './WorkService';
import { MangaServiceError } from '@errors/MangaServiceError';

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
    async getMangaById(id: number) {
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
    async getMangaByName(name: string) {
        const manga = await this.getWorkByName(name);

        if (!manga) {
            throw new MangaServiceError('Manga not found.', 404);
        }
        return this.getMangasWithChapter(manga);
    }

    /**
     * Récupère les mangas
     */
    async getMangas() {
        const mangas =  await this.getWorks();
        const mangasWithChapter = mangas.map(this.getMangasWithChapter.bind(this));
        console.log(mangasWithChapter);
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

    async updateChapter(id: number, chapter: string) {
        return await this.prisma.work.update({
            data: {
                mangaChapter: chapter,
            },
            where: {
                id: id,
            },
        });
    }

    
    
    private getMangasWithChapter(manga: any)  {
        return {
            ...manga,
            chapter: manga.mangaChapter,
        }
    }
}
