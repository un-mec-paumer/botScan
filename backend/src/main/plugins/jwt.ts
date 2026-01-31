import fp from 'fastify-plugin';
import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default fp(async (fastify) => {
  if (process.env.NODE_ENV === 'test' || process.env.CI === 'true') {
    fastify.register(import('@fastify/jwt'), {
      secret: 'testsecret',
      sign: { algorithm: 'HS256', expiresIn: '15m' },
      verify: { algorithms: ['HS256'] },
    });
    return;
  }

  fastify.register(import('@fastify/jwt'), {
    secret: {
      private: fs.readFileSync(
        path.join(__dirname, '../../../config/jwt/private.pem'),
        'utf8'
      ),
      public: fs.readFileSync(
        path.join(__dirname, '../../../config/jwt/public.pem'),
        'utf8'
      ),
    },
    sign: { algorithm: 'RS256', expiresIn: '15m' },
    verify: { algorithms: ['RS256'] },
  });
});
