import { PrismaClient } from '@prisma/client';
import { AnimeServiceError } from '@errors/AnimeServiceError';
import { ModelAnime } from '@models/anime';
import { AddAnimeDtoType } from '@dtos/animes/AddAnimeDto';

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
        return animes.map(new ModelAnime) as ModelAnime[];
    }

    /**
     * Récupère un anime.
     * @param id L'id du anime.
     */
    async addAnime(data: AddAnimeDtoType) {
        const anime = await this.prisma.Anime.create({
            data: data
        });

        if (!anime) {
            throw new AnimeServiceError('Anime already exists.', 409);
        }

        return anime;
    }

    async updateSeason(id: number, season: string): Promise<ModelAnime> {
        const anime = await this.prisma.Anime.update({
            data: {
                season: season,
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

    async updateEpisode(id: number, episode: string): Promise<ModelAnime> {
        const anime = await this.prisma.Anime.update({
            data: {
                episode: episode,
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
