import type { FastifyPluginAsync, FastifySchema } from 'fastify';
import { GlobalAnimeSourceService } from '@services/GlobalAnimeSourceService';
import { GlobalAnimeSourceServiceError } from '@errors/GlobalAnimeSourceServiceError';
import { DisplayGlobalAnimeSourceDto } from '@dtos/animes/sources/DisplayGlobalAnimeSourceDto';
import { ErrorDto } from '@dtos/ErrorDto';

const updateUrlRoute: FastifyPluginAsync = async (fastify) => {
    const globalSourceService = new GlobalAnimeSourceService(fastify.prisma);

    const schema: FastifySchema = {
        summary: 'Updates the url of the source',
        description: 'Updates the url of the source',
        tags: ['animes', 'global-sources'],
        security: [{ bearerAuth: [] }],
        response: {
            201: DisplayGlobalAnimeSourceDto,
            401: ErrorDto,
        },
    };

    fastify.patch(
        '/update-url/:id',
        {
            schema,
        },
        async (request, reply) => {
            try {
                const { id } = request.params as { id: number };
                const { url } = request.body as { url: string };

                const globalSource = await globalSourceService.updateUrl(id, url);

                return reply.code(200).send(globalSource.display());
            } catch (err) {
                if (err instanceof GlobalAnimeSourceServiceError) {
                    return reply
                        .code(err.statusCode)
                        .send({ error: err.message });
                }
                throw err;
            }
        }
    );
};

export default updateUrlRoute;
