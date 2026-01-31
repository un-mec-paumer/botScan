import Fastify from 'fastify';
import app from '../main/app';

export async function build(t: any) {
  const fastify = Fastify();
  await fastify.register(app);
  t.after(() => fastify.close());
  return fastify;
}
