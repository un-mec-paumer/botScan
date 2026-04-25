import type { FastifyPluginAsync, FastifySchema } from 'fastify';
import { AnimeService } from '@services/AnimeService';
import { AnimeServiceError } from '@errors/AnimeServiceError';
import { DisplayAnimeDto } from '@dtos/animes/DisplayAnimeDto';
import { ErrorDto } from '@dtos/ErrorDto';

const getAnimeByIdRoute: FastifyPluginAsync = async (fastify) => {
    const animeService = new AnimeService(fastify.prisma);

    const schema: FastifySchema = {
        summary: 'Get the anime associated with the id',
        description: 'Get the anime associated with the id',
        tags: ['animes'],
        response: {
            200: DisplayAnimeDto,
            401: ErrorDto,
        },
    };

    fastify.get(
        '/id/:id',
        {
            schema,
        },
        async (request, reply) => {
            try {
                const { id } = request.params as { id: string };
                const anime = await animeService.getAnimeById(Number.parseInt(id));

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

export default getAnimeByIdRoute;
