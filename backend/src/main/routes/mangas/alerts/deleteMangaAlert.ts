import type { FastifyPluginAsync, FastifySchema } from 'fastify';
import { z } from 'zod';
import { MangaAlertService } from '@services/MangaAlertService';
import { MangaAlertServiceError } from '@errors/MangaAlertServiceError';
import { ErrorDto } from '@dtos/ErrorDto';

const deleteMangaAlertRoute: FastifyPluginAsync = async (fastify) => {
    const mangaAlertService = new MangaAlertService(fastify.prisma);

    const schema: FastifySchema = {
        summary: 'Hard delete alert by manga and user ids',
        description: 'Hard delete alert by manga and user ids',
        tags: ['alerts', 'mangas'],
        security: [{ bearerAuth: [] }],
        response: {
            200: z.null(),
            404: ErrorDto,
        },
    };

    fastify.delete(
        '/:userId/:mangaId',
        {
            schema,
        },
        async (request, reply) => {
            try {
                const { userId, mangaId } = request.body as {
                    userId: string;
                    mangaId: number;
                };

                await mangaAlertService.deleteAlert(userId, mangaId);

                return reply.code(200);
            } catch (err) {
                if (err instanceof MangaAlertServiceError) {
                    return reply
                        .code(err.statusCode)
                        .send({ error: err.message });
                }
                throw err;
            }
        }
    );
};

export default deleteMangaAlertRoute;
