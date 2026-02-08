import type { FastifyPluginAsync, FastifySchema } from 'fastify';
import { AuthService } from '../../services/AuthService';
import { AuthServiceError } from '../../errors/AuthServiceError';
import {
  RefreshTokenRequestDto,
  RefreshTokenRequestDtoType,
} from '../../dtos/RefreshTokenRequestDto';
import { z } from 'zod';

const refreshRoute: FastifyPluginAsync = async (fastify) => {
  const authService = new AuthService(fastify.prisma);

  const schema: FastifySchema = {
    summary: 'Refresh access token',
    description: 'Provides a new access token using a valid refresh token.',
    tags: ['auth'],
    body: RefreshTokenRequestDto,
    response: {
      200: z.object({
        accessToken: z.string().describe('The new JWT access token'),
      }),
      401: z.object({
        error: z.string(),
      }),
      500: z.object({
        error: z.string(),
      }),
    },
  };

  fastify.post<{ Body: RefreshTokenRequestDtoType }>(
    '/refresh',
    { schema },
    async (request, reply) => {
      const { refreshToken } = request.body;

      try {
        const user = await authService.verifyAndRefreshToken(
          refreshToken,
          fastify
        );

        const accessToken = fastify.jwt.sign(
          { sub: user.id, role: user.role },
          { expiresIn: '15m' }
        );

        reply.send({ accessToken });
      } catch (err) {
        if (err instanceof AuthServiceError) {
          return reply.code(err.statusCode).send({ error: err.message });
        } else {
          console.error(
            'Erreur inconnue lors du rafraîchissement du token',
            err
          );
          return reply
            .code(500)
            .send({ error: 'Impossible de rafraîchir le token' });
        }
      }
    }
  );
};

export default refreshRoute;
