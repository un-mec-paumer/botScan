import type { FastifyPluginAsync } from 'fastify';
import getMangaByIdRoute from './getMangaById';
import getMangaByNameRoute from './getMangaByName';
import getMangasRoute from './getMangas';
import addMangaRoute from './addManga';
import updateChapterRoute from './updateChapter';
import getMangaSourcesRoute from './getMangaSources';
import globalMangaSourceRoutes from './global-sources';
import mangaSourceRoutes from './sources';

const mangaRoutes: FastifyPluginAsync = async (fastify) => {
    await fastify.register(addMangaRoute);
    await fastify.register(getMangaByIdRoute);
    await fastify.register(getMangaByNameRoute);
    await fastify.register(getMangasRoute);
    await fastify.register(updateChapterRoute);
    await fastify.register(getMangaSourcesRoute);
    await fastify.register(globalMangaSourceRoutes, '/global-sources')
    await fastify.register(mangaSourceRoutes, '/sources')
};

export default mangaRoutes;
