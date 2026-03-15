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

const addAlertRoute: FastifyPluginAsync = async (fastify) => {
    const alertService = new AlertService(fastify.prisma);

    const schema: FastifySchema = {
        summary: 'Add alert with work and user ids',
        description:
            'Add alert with work and user ids. Non-specified params keeps the current value, false otherwise',
        tags: ['alerts'],
        security: [{ bearerAuth: [] }],
        body: UpdateAlertDto,
        response: {
            201: z.array(DisplayAlertDto),
            404: ErrorDto,
        },
    };

    fastify.post<{ Body: UpdateAlertDtoType }>(
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

                const existingAlert = await alertService.getAlert(
                    userId,
                    workId
                );

                let alert = null;

                if (existingAlert) {
                    alert = await alertService.updateAlert(
                        userId,
                        workId,
                        mangaAlert,
                        animeAlert
                    );
                } else {
                    alert = await alertService.addAlert(
                        userId,
                        workId,
                        mangaAlert ?? false,
                        animeAlert ?? false
                    );
                }

                return reply.code(201).send(alert);
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

export default addAlertRoute;
