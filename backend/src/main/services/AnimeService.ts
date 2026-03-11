import { PrismaClient } from '@prisma/client';
import { WorkService } from './WorkService';
import { AnimeServiceError } from '../errors/AnimeServiceError';

export class MangaService extends WorkService {
    constructor(protected readonly prisma: PrismaClient) {
        super(prisma);

        this.selection = {
            ...this.selection,
            animeSource: true,
            animeSeason: true,
            animeEpisode: true,
        };
    }

    /**
     * Récupère un anime.
     * @param id L'ID de l'anime.
     */
    async getAnimeById(id: number) {
        return await this.getWorkById(id);
    }

    /**
     * Récupère un anime.
     * @param id L'ID de l'anime.
     */
    async getAnimeByName(name: string) {
        return await this.getWorkByName(name);
    }

    /**
     * Récupère les animes
     */
    async getAnimes() {
        return await this.prisma.work.findMany();
    }

    /**
     * Récupère un anime.
     * @param id L'ID de l'anime.
     */
    /*async addAnime() {
    const anime = await this.prisma.anime.create({
    });

    if (!anime) {
      throw new AnimeServiceError('Anime already exists.', 409);
    }

    return anime;
  }*/
}
