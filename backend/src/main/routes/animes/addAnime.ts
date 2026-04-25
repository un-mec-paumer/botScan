import type { FastifyPluginAsync, FastifySchema } from 'fastify';
import { AnimeService } from '@services/AnimeService';
import { AnimeServiceError } from '@errors/AnimeServiceError';
import { AddAnimeDto, AddAnimeDtoType } from '@dtos/animes/AddAnimeDto';
import { DisplayAnimeDto } from '@dtos/animes/DisplayAnimeDto';
import { ErrorDto } from '@dtos/ErrorDto';

const addAnimeRoute: FastifyPluginAsync = async (fastify) => {
    const animeService = new AnimeService(fastify.prisma);

    const schema: FastifySchema = {
        summary: 'Add anime',
        description:
            'Add the anime.',
        tags: ['animes'],
        body: AddAnimeDto,
        response: {
            201: DisplayAnimeDto,
            401: ErrorDto,
        },
    };

    fastify.post<{ Body: AddAnimeDtoType }>(
        '/',
        {
            schema,
        },
        async (request, reply) => {
            try {
                const body = request.body;
                const anime = await animeService.addAnime(body);

                return reply.code(200).send(anime.display());
            } catch (err) {
                if (err instanceof AnimeServiceError) {
                    return reply
                        .code(err.statusCode)
                        .send({ error: err.message });
                }
                throw err;
            }
        }
    );
};

export default addAnimeRoute;
