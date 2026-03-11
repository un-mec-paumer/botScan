import type { FastifyPluginAsync, FastifySchema } from 'fastify';
import { MangaService } from '../../../services/MangaService';
import { WorkServiceError } from '../../../errors/WorkServiceError';
import { DisplayMangaDto } from '../../../dtos/mangas/DisplayMangaDto';
import { ErrorDto } from '../../../dtos/ErrorDto';

const updateChapterRoute: FastifyPluginAsync = async (fastify) => {
    const mangaService = new MangaService(fastify.prisma);

    const schema: FastifySchema = {
        summary: 'Updates the chapter of the manga',
        description: 'Updates the chapter of the manga',
        tags: ['mangas'],
        security: [{ bearerAuth: [] }],
        response: {
            201: DisplayMangaDto,
            401: ErrorDto,
        },
    };

    fastify.patch(
        '/update-chapter/:id',
        {
            schema,
        },
        async (request, reply) => {
            try {
                const { id } = request.params as { id: number };
                const { chapter } = request.body as { chapter: string };

                const manga = await mangaService.updateChapter(id, chapter);

                return reply.code(200).send(manga);
            } catch (err) {
                if (err instanceof WorkServiceError) {
                    return reply
                        .code(err.statusCode)
                        .send({ error: err.message });
                }
                throw err;
            }
        }
    );
};

export default updateChapterRoute;
