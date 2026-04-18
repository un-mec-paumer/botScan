import type { FastifyPluginAsync, FastifySchema } from 'fastify';
import { z } from 'zod';
import { MangaAlertService } from '@services/MangaAlertService';
import { MangaAlertServiceError } from '@errors/MangaAlertServiceError';
import { DisplayMangaAlertDto } from '@dtos/mangas/alerts/DisplayMangaAlertDto';
import { ErrorDto } from '@dtos/ErrorDto';

const getMangaAlertsByUserIdRoute: FastifyPluginAsync = async (fastify) => {
    const mangaAlertService = new MangaAlertService(fastify.prisma);

    const schema: FastifySchema = {
        summary: 'Get alerts by user id',
        description: 'Get alerts by user id',
        tags: ['alerts'],
        security: [{ bearerAuth: [] }],
        response: {
            200: z.array(DisplayMangaAlertDto),
            401: ErrorDto,
        },
    };

    fastify.get(
        '/user-id/:userId',
        {
            schema,
        },
        async (request, reply) => {
            try {
                const { userId } = request.params as { userId: string };

                const alerts = await mangaAlertService.getAlertsByUserId(userId);

                return reply.code(200).send(alerts.map(alert => alert.display()));
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

export default getMangaAlertsByUserIdRoute;
