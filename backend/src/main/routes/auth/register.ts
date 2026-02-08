import type { FastifyPluginAsync, FastifySchema } from 'fastify';
import {
  RegisterUserRequestDto,
  RegisterUserRequestDtoType,
} from '../../dtos/RegisterUserRequestDto';
import { AuthService } from '../../services/AuthService';
import { AuthServiceError } from '../../errors/AuthServiceError';
import { z } from 'zod';

const registerRoute: FastifyPluginAsync = async (fastify) => {
  const authService = new AuthService(fastify.prisma);

  const schema: FastifySchema = {
    summary: 'Register a new user',
    description: 'Creates a new user account.',
    tags: ['auth'],
    body: RegisterUserRequestDto,
    response: {
      201: z.object({
        id: z.string().uuid(),
        email: z.string().email(),
        username: z.string().nullable(),
      }),
      400: z.object({
        error: z.string(),
        details: z.any().optional(),
      }),
      409: z.object({
        error: z.string(),
      }),
    },
  };

  fastify.post<{ Body: RegisterUserRequestDtoType }>(
    '/register',
    { schema },
    async (request, reply) => {
      const { email, password, username } =
        request.body;

      try {
        const user = await authService.registerUser(
          email,
          password,
          username
        );
        reply.code(201).send({
          id: user.id,
          email: user.email,
          username: user.username ?? null,
        });
      } catch (err) {
        if (err instanceof AuthServiceError) {
          return reply.code(err.statusCode).send({ error: err.message });
        }
        throw err;
      }
    }
  );
};

export default registerRoute;
