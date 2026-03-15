import type { FastifyPluginAsync, FastifySchema } from 'fastify';
import { z } from 'zod';
import { AlertService } from '@services/AlertService';
import { AlertServiceError } from '@errors/AlertServiceError';
import { DisplayAlertDto } from '@dtos/alerts/DisplayAlertDto';
import {
    UpdateAlertDto,
    UpdateAlertDtoType,
} from '@dtos/alerts/UpdateAlertDto';
import { ErrorDto } from '@dtos/ErrorDto';

const updateAlertRoute: FastifyPluginAsync = async (fastify) => {
    const alertService = new AlertService(fastify.prisma);

    const schema: FastifySchema = {
        summary: 'Update alert with work and user ids',
        description:
            'Update alert with work and user ids. Non-specified params keeps the current value, false otherwise',
        tags: ['alerts'],
        security: [{ bearerAuth: [] }],
        body: UpdateAlertDto,
        response: {
            200: z.array(DisplayAlertDto),
            404: ErrorDto,
        },
    };

    fastify.patch<{ Body: UpdateAlertDtoType }>(
        '/',
        {
            schema,
        },
        async (request, reply) => {
            try {
                const { userId, workId, mangaAlert, animeAlert } =
                    request.body as {
                        userId: string;
                        workId: number;
                        mangaAlert: boolean | null;
                        animeAlert: boolean | null;
                    };

                const alert = await alertService.updateAlert(
                    userId,
                    workId,
                    mangaAlert,
                    animeAlert
                );

                return reply.code(200).send(alert);
            } catch (err) {
                if (err instanceof AlertServiceError) {
                    return reply
                        .code(err.statusCode)
                        .send({ error: err.message });
                }
                throw err;
            }
        }
    );
};

export default updateAlertRoute;
