import type { FastifyPluginAsync, FastifySchema } from 'fastify';
import { AnimeService } from '@services/AnimeService';
import { AnimeServiceError } from '@errors/AnimeServiceError';
import { DisplayAnimeDto } from '@dtos/animes/DisplayAnimeDto';
import { ErrorDto } from '@dtos/ErrorDto';

const getAnimeByNameRoute: FastifyPluginAsync = async (fastify) => {
    const animeService = new AnimeService(fastify.prisma);

    const schema: FastifySchema = {
        summary: 'Get the anime associated with the name',
        description: 'Get the anime associated with the name',
        tags: ['animes'],
        response: {
            200: DisplayAnimeDto,
            401: ErrorDto,
        },
    };

    fastify.get(
        '/name/:name',
        {
            schema,
        },
        async (request, reply) => {
            try {
                const { name } = request.params as { name: string };

                const anime = await animeService.getAnimeByName(name);

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

export default getAnimeByNameRoute;
