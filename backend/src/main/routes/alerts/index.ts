import type { FastifyPluginAsync } from 'fastify';
import addMangaAlertRoute from './addMangaAlert';
import deleteMangaAlertRoute from './deleteMangaAlert';
import getMangaAlertRoute from './getMangaAlert';
import getMangaAlertsByUserIdRoute from './getMangaAlertsByUserId';
import getMangaAlertsByMangaIdRoute from './getMangaAlertsByMangaId';

const alertRoutes: FastifyPluginAsync = async (fastify) => {
    await fastify.register(addMangaAlertRoute);
    await fastify.register(deleteMangaAlertRoute);
    await fastify.register(getMangaAlertRoute);
    await fastify.register(getMangaAlertsByUserIdRoute);
    await fastify.register(getMangaAlertsByMangaIdRoute);
};

export default alertRoutes;
