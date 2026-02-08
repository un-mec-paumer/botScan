import type { FastifyPluginAsync } from 'fastify';
import pingRoute from './ping';
import testRoute from './test';
import usersRoutes from '../users';

const apiRoutes: FastifyPluginAsync = async (fastify) => {
  if (process.env.NODE_ENV !== 'test') {
    fastify.addHook('onRequest', fastify.authenticate);
  }

  await fastify.register(pingRoute);
  await fastify.register(testRoute);
  await fastify.register(usersRoutes, { prefix: '/users' });
};

export default apiRoutes;
