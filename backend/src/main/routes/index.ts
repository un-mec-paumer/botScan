import type { FastifyPluginAsync } from 'fastify';
import apiRoutes from './api/index';
import authRoutes from './auth/index';
import animeRoutes from './animes';
import mangaRoutes from './mangas';
import userRoutes from './users';

const mainRoutes: FastifyPluginAsync = async (fastify) => {
    // if (process.env.NODE_ENV !== 'test') {
    //     fastify.addHook('onRequest', fastify.authenticate);
    // }

    await fastify.register(apiRoutes, { prefix: '/' });
    await fastify.register(authRoutes, { prefix: '/auth' });
    await fastify.register(animeRoutes, { prefix: '/animes' });
    await fastify.register(mangaRoutes, { prefix: '/mangas' });
    await fastify.register(userRoutes, { prefix: '/users' });
};

export default mainRoutes;
