import type { FastifyPluginAsync, FastifySchema } from 'fastify';
import { z } from 'zod';
import { MangaAlertService } from '@services/MangaAlertService';
import { MangaAlertServiceError } from '@errors/MangaAlertServiceError';
import { DisplayMangaAlertDto } from '@dtos/mangas/alerts/DisplayMangaAlertDto';
import { ErrorDto } from '@dtos/ErrorDto';

const getMangaAlertRoute: FastifyPluginAsync = async (fastify) => {
    const mangaAlertService = new MangaAlertService(fastify.prisma);

    const schema: FastifySchema = {
        summary: 'Get alert by manga and user ids',
        description: 'Get alert by manga and user ids',
        tags: ['alerts'],
        security: [{ bearerAuth: [] }],
        response: {
            200: z.array(DisplayMangaAlertDto),
            404: ErrorDto,
        },
    };

    fastify.get(
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

                const alert = await mangaAlertService.getAlert(userId, mangaId);

                return reply.code(200).send(alert);
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

export default getMangaAlertRoute;
