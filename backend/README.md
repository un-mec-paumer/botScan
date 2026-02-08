# Getting Started with [Fastify-CLI](https://www.npmjs.com/package/fastify-cli)

This project was bootstrapped with Fastify-CLI.

## Available Scripts

In the project directory, you can run:

### `npm run dev`

To start the app in dev mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `npm start`

For production mode

### `npm run test`

Run the test cases.

## Learn More

To learn Fastify, check out the [Fastify documentation](https://fastify.dev/docs/latest/).

##

Pour utiliser signer et valider les JWT il faut générer des clés dans /config/jwt.
La clé privé peut-être générée avec la commande : openssl genrsa -out private.pem 2048
La clé publique peut-être générée avec la commande : openssl rsa -in private.pem -outform PEM -pubout -out public.pem

## Docker

### Pré-requis
- Un fichier `config/jwt/private.pem` et `config/jwt/public.pem` (RS256) :
  ```bash
  mkdir -p config/jwt
  openssl genrsa -out config/jwt/private.pem 2048
  openssl rsa -in config/jwt/private.pem -outform PEM -pubout -out config/jwt/public.pem
  ```
- La variable `CHATGPT_API_KEY` exportée dans ton shell (ou dans un `.env` local si tu utilises Docker Compose v2).

### Lancer avec Docker Compose
```bash
docker compose up --build
```

- L'API Fastify est exposée sur `http://localhost:3000`.
- Postgres tourne en local sur `localhost:5432` (db `botscan_db`).
- Les migrations Prisma sont appliquées automatiquement au démarrage du container backend.


If you're missing jwt keys (e.g. config directory not exists)
```bash
npm run generate-jwt-keys
```



⚠️ Make sure line breaks are preserved.


