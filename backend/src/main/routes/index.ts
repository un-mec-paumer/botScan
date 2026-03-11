import type { FastifyPluginAsync } from 'fastify';
import authRoutes from './auth/index';
import apiRoutes from './api/index';
import alertRoutes from './alerts';
import userRoutes from './users';
import workRoutes from './works';

const mainRoutes: FastifyPluginAsync = async (fastify) => {
    /*if (process.env.NODE_ENV !== 'test') {
    fastify.addHook('onRequest', fastify.authenticate);
  }*/

    await fastify.register(authRoutes, { prefix: '/auth' });
    await fastify.register(apiRoutes, { prefix: '/' });
    await fastify.register(alertRoutes, { prefix: '/alerts' });
    await fastify.register(userRoutes, { prefix: '/users' });
    await fastify.register(workRoutes, { prefix: '/works' });
};

export default mainRoutes;
