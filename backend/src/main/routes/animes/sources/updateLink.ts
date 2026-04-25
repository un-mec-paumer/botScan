import type { FastifyPluginAsync, FastifySchema } from 'fastify';
import { AnimeSourceService } from '@services/AnimeSourceService';
import { AnimeSourceServiceError } from '@errors/AnimeSourceServiceError';
import { DisplayAnimeSourceDto } from '@dtos/animes/sources/DisplayAnimeSourceDto';
import { ErrorDto } from '@dtos/ErrorDto';

const updateLinkRoute: FastifyPluginAsync = async (fastify) => {
    const sourceService = new AnimeSourceService(fastify.prisma);

    const schema: FastifySchema = {
        summary: 'Updates the link of the source',
        description: 'Updates the link of the source',
        tags: ['animes', 'sources'],
        security: [{ bearerAuth: [] }],
        response: {
            201: DisplayAnimeSourceDto,
            401: ErrorDto,
        },
    };

    fastify.patch(
        '/update-link/:animeId/:globalAnimeSourceId',
        {
            schema,
        },
        async (request, reply) => {
            try {
                const { animeId, globalAnimeSourceId } = request.params as { animeId: number, globalAnimeSourceId: number };
                const { link } = request.body as { link: string };

                const source = await sourceService.updateLink(link, animeId, globalAnimeSourceId);

                return reply.code(200).send(source.display());
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

export default updateLinkRoute;
