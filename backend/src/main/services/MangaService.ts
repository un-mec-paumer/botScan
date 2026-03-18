import { PrismaClient } from '@prisma/client';
import { WorkService } from './WorkService';
import { MangaServiceError } from '@errors/MangaServiceError';
import { ModelManga } from '@models/works/manga';
import { DisplayMangaDtoType } from '@dtos/mangas/DisplayMangaDto';

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
    async getMangaById(id: number): Promise<ModelManga> {
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
    async getMangaByName(name: string): Promise<ModelManga> {
        const manga = await this.getWorkByName(name);

        if (!manga) {
            throw new MangaServiceError('Manga not found.', 404);
        }

        return this.getMangasWithChapter(manga);
    }

    /**
     * Récupère les mangas
     */
    async getMangas(): Promise<ModelManga[]> {
        const mangas = await this.getWorks();
        const mangasWithChapter = mangas.map((manga) => this.getMangasWithChapter(manga));
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

    async updateChapter(id: number, chapter: string): Promise<ModelManga> {
        const manga = await this.prisma.work.update({
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


        return this.getMangasWithChapter(manga);
    }

    
    
    private getMangasWithChapter(manga: any): ModelManga { // oui pas de any mais jsp quel type mettre
        return new ModelManga({
            ...manga,
            chapter: manga.mangaChapter,
        });
    }
}
