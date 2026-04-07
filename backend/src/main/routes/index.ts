import type { FastifyPluginAsync } from 'fastify';
import alertRoutes from './alerts';
import apiRoutes from './api/index';
import authRoutes from './auth/index';
import mangaRoutes from './mangas';
import userRoutes from './users';

const mainRoutes: FastifyPluginAsync = async (fastify) => {
    // if (process.env.NODE_ENV !== 'test') {
    //     fastify.addHook('onRequest', fastify.authenticate);
    // }

    await fastify.register(alertRoutes, { prefix: '/alerts' });
    await fastify.register(apiRoutes, { prefix: '/' });
    await fastify.register(authRoutes, { prefix: '/auth' });
    await fastify.register(mangaRoutes, { prefix: '/mangas' });
    await fastify.register(userRoutes, { prefix: '/users' });
};

export default mainRoutes;
