import type { FastifyPluginAsync } from 'fastify';
import getMangaByIdRoute from './getMangaById';
import getMangaByNameRoute from './getMangaByName';
import getMangasRoute from './getMangas';
import addMangaRoute from './addManga';
import updateChapterRoute from './updateChapter';

const mangaRoutes: FastifyPluginAsync = async (fastify) => {
    await fastify.register(addMangaRoute);
    await fastify.register(getMangaByIdRoute);
    await fastify.register(getMangaByNameRoute);
    await fastify.register(getMangasRoute);
    await fastify.register(updateChapterRoute);
};

export default mangaRoutes;
