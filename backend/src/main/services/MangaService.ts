import { PrismaClient } from '@prisma/client';
import { WorkService } from './WorkService';
import { MangaServiceError } from '../errors/MangaServiceError';

export class MangaService extends WorkService {

  constructor(protected readonly prisma: PrismaClient) {
    super(prisma);

    this.selection = {
      ...this.selection,
      mangaSource: true,
      mangaChapter: true,
    }
  }

  /**
   * Récupère un manga.
   * @param id L'id du manga.
   */
  async getMangaById(id: number) {
    return await this.getWorkById(id);
  }

  /**
   * Récupère un manga.
   * @param id L'id du manga.
   */
  async getMangaByName(name: string) {
    return await this.getWorkByName(name);
  }

  /**
   * Récupère les mangas
   */
  async getMangas() {
    return await this.getWorks();
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
          mangaChapter: chapter
        },
        where: {
          id: id
        }
      })
    }
}
