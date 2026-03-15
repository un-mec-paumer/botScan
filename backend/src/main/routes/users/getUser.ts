import type { FastifyPluginAsync, FastifySchema } from 'fastify';
import { UserService } from '@services/UserService';
import { UserServiceError } from '@errors/UserServiceError';
import { DisplayUserDto } from '@dtos/users/DisplayUserDto';
import { ErrorDto } from '@dtos/ErrorDto';

const getUserRoute: FastifyPluginAsync = async (fastify) => {
    const userService = new UserService(fastify.prisma);

    const schema: FastifySchema = {
        summary: 'Get user',
        description: 'Retrieves the user.',
        tags: ['users'],
        security: [{ bearerAuth: [] }],
        response: {
            200: DisplayUserDto,
            401: ErrorDto,
        },
    };

    fastify.get(
        '/get/:userId',
        {
            schema,
        },
        async (request, reply) => {
            try {
                const { userId } = request.params as { userId: string };

                const user = await userService.getUser(userId);

                return reply.code(200).send(user);
            } catch (err) {
                if (err instanceof UserServiceError) {
                    return reply
                        .code(err.statusCode)
                        .send({ error: err.message });
                }
                throw err;
            }
        }
    );
};

export default getUserRoute;
