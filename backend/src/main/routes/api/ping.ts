import type { FastifyPluginAsync, FastifySchema } from 'fastify';
import { z } from 'zod';

const pingRoute: FastifyPluginAsync = async (fastify) => {
  const schema: FastifySchema = {
    summary: 'Ping',
    description: 'A simple ping-pong endpoint to check if the server is alive.',
    tags: ['health-check'],
    response: {
      200: z.string(),
    },
  };

  fastify.get('/ping', { schema }, async () => {
    return 'pong\n';
  });
};

export default pingRoute;
