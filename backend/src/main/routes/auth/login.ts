import type { FastifyPluginAsync, FastifySchema } from 'fastify';
import {
  LoginUserRequestDto,
  LoginUserRequestDtoType,
} from '../../dtos/LoginUserRequestDto';
import { AuthService } from '../../services/AuthService';
import { AuthServiceError } from '../../errors/AuthServiceError';
import { z } from 'zod';

const loginRoute: FastifyPluginAsync = async (fastify) => {
  const authService = new AuthService(fastify.prisma);

  const schema: FastifySchema = {
    summary: 'User login',
    description: 'Authenticates a user and returns access and refresh tokens.',
    tags: ['auth'],
    body: LoginUserRequestDto,
    response: {
      200: z.object({
        accessToken: z.string(),
        refreshToken: z.string(),
      }),
      400: z.object({
        error: z.string(),
        details: z.any().optional(),
      }),
      401: z.object({
        error: z.string(),
      }),
    },
  };

  fastify.post<{ Body: LoginUserRequestDtoType }>(
    '/login',
    { schema },
    async (request, reply) => {
      try {
        const user = await authService.loginUser(request.body);

        const accessToken = fastify.jwt.sign(
          { sub: user.id, role: user.role },
          { expiresIn: '15m' }
        );

        const refreshToken = fastify.jwt.sign(
          { sub: user.id, type: 'refresh' },
          { expiresIn: '7d' }
        );

        await fastify.prisma.authToken.create({
          data: {
            userId: user.id,
            refreshToken,
            refreshExpiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          },
        });

        reply.send({ accessToken, refreshToken });
      } catch (err) {
        if (err instanceof AuthServiceError) {
          return reply.code(err.statusCode).send({ error: err.message });
        }
        throw err;
      }
    }
  );
};

export default loginRoute;
