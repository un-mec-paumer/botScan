import path from 'node:path';
import { fileURLToPath } from 'node:url';
import AutoLoad from '@fastify/autoload';
import type { FastifyPluginAsync } from 'fastify';
import mainRoutes from './routes';

export const options = {};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app: FastifyPluginAsync = async (fastify, opts) => {
  try {
    await fastify.register(AutoLoad, {
      dir: path.join(__dirname, 'plugins'),
      options: { ...opts },
    });
  } catch (err) {
    console.error('Impossible de charger les plugins:', err);
  }

  // try {
  //   await fastify.register(AutoLoad, {
  //     dir: path.join(__dirname, 'routes'),
  //     options: { ...opts },
  //   });
  // } catch (err) {
  //   console.error('Impossible de charger les routes:', err);
  // }

  await fastify.register(mainRoutes, opts);
};

export default app;
