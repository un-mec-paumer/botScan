import { FastifyPluginAsync, FastifySchema } from 'fastify';
import { z } from 'zod';

const testRoute: FastifyPluginAsync = async (fastify) => {
  const schema: FastifySchema = {
    summary: 'API Welcome',
    description: 'A welcome message for the API.',
    tags: ['api'],
    response: {
      200: z.object({
        message: z.string(),
      }),
    },
  };

  fastify.get('/', { schema }, async () => {
    return { message: 'Welcome to the API!' };
  });
};

export default testRoute;
