import type { FastifyPluginAsync, FastifySchema } from 'fastify';
import { GlobalMangaSourceService } from '@services/GlobalMangaSourceService';
import { GlobalMangaSourceServiceError } from '@errors/GlobalMangaSourceServiceError';
import { DisplayGlobalMangaSourceDto } from '@dtos/mangas/sources/DisplayGlobalMangaSourceDto';
import { ErrorDto } from '@dtos/ErrorDto';

const updateUrlRoute: FastifyPluginAsync = async (fastify) => {
    const globalSourceService = new GlobalMangaSourceService(fastify.prisma);

    const schema: FastifySchema = {
        summary: 'Updates the url of the source',
        description: 'Updates the url of the source',
        tags: ['mangas', 'global-sources'],
        security: [{ bearerAuth: [] }],
        response: {
            201: DisplayGlobalMangaSourceDto,
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
                if (err instanceof GlobalMangaSourceServiceError) {
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
