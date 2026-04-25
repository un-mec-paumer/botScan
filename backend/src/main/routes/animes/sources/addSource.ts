import type { FastifyPluginAsync, FastifySchema } from 'fastify';
import { AnimeSourceService } from '@services/AnimeSourceService';
import { AnimeSourceServiceError } from '@errors/AnimeSourceServiceError';
import { DisplayAnimeSourceDto } from '@dtos/animes/sources/DisplayAnimeSourceDto';
import { ErrorDto } from '@dtos/ErrorDto';

const addSourceRoute: FastifyPluginAsync = async (fastify) => {
    const animeSourceService = new AnimeSourceService(fastify.prisma);

    const schema: FastifySchema = {
        summary: 'Add the source to the anime',
        description: 'Add the source to the anime',
        tags: ['animes', 'sources'],
        security: [{ bearerAuth: [] }],
        response: {
            201: DisplayAnimeSourceDto,
            401: ErrorDto,
        },
    };

    fastify.post(
        '/',
        {
            schema,
        },
        async (request, reply) => {
            try {
                const {
                    link,
                    animeId,
                    globalAnimeSourceId
                } = request.body as {
                    link: string,
                    animeId: number,
                    globalAnimeSourceId: number
                };

                const animeSource = await animeSourceService.addSource(link, globalAnimeSourceId, animeId);

                return reply.code(200).send(animeSource.display());
            } catch (err) {
                if (err instanceof AnimeSourceServiceError) {
                    return reply
                        .code(err.statusCode)
                        .send({ error: err.message });
                }
                throw err;
            }
        }
    );
};

export default addSourceRoute;
