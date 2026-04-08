import { PrismaClient } from '@prisma/client';
import { AnimeServiceError } from '@errors/AnimeServiceError';
import { ModelAnime } from '@models/anime';

export class AnimeService {
    private readonly selection: object = {
        id: true,
        name: true,
        synopsis: true,
        imgUrl: true,
        season: true,
        episode: true,
        animeSources: {
            select: {
                animeSource: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        },
    };

    constructor(protected readonly prisma: PrismaClient) { }

    /**
     * Récupère un anime.
     * @param id L'id du anime.
     */
    async getAnimeById(id: number): Promise<ModelAnime> {
        const anime = await this.prisma.Anime.findUnique({
            select: this.selection,
            where: { id },
        });

        if (!anime) {
            throw new AnimeServiceError('Anime not found.', 404);
        }

        return new ModelAnime(anime);
    }

    /**
     * Récupère un anime.
     * @param id L'id du anime.
     */
    async getAnimeByName(name: string): Promise<ModelAnime> {
        const anime = await this.prisma.Anime.findFirst({
            select: this.selection,
            where: {
                name: {
                    contains: name,
                },
            },
        });

        if (!anime) {
            throw new AnimeServiceError('Anime not found.', 404);
        }

        return new ModelAnime(anime);
    }

    /**
     * Récupère les animes
     */
    async getAnimes(): Promise<ModelAnime[]> {
        const animes = await this.prisma.Anime.findMany({ select: this.selection });
        const animesWithChapter = animes.map(new ModelAnime) as ModelAnime[];
        return animesWithChapter;
    }

    /**
     * Récupère un anime.
     * @param id L'id du anime.
     */
    async addAnime() {
        const anime = await this.prisma.Anime.create({
        });

        if (!anime) {
            throw new AnimeServiceError('Anime already exists.', 409);
        }

        return anime;
    }

    async updateChapter(id: number, chapter: string): Promise<ModelAnime> {
        const anime = await this.prisma.Anime.update({
            data: {
                animeChapter: chapter,
            },
            where: {
                id: id,
            },
        });

        if (!anime) {
            throw new AnimeServiceError('Anime not found.', 404);
        }

        return new ModelAnime(anime);
    }
}
