import type { FastifyPluginAsync } from 'fastify';
import mangaRoutes from './mangas';

const workRoutes: FastifyPluginAsync = async (fastify) => {
    await fastify.register(mangaRoutes, { prefix: '/mangas' });
};

export default workRoutes;
