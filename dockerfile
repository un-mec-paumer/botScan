# 1. Utilisation d'une image légère de Node.js
FROM node:22.13.1-alpine

# 2. Installation des dépendances système nécessaires à Puppeteer
RUN apk add --no-cache \
    chromium \
    libx11-xcb1 \
    libxcomposite1 \
    libxcursor1 \
    libxdamage1 \
    libxfixes3 \
    libxi6 \
    libxrandr2 \
    libgbm1 \
    libglib2.0-0 \
    libnss3 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libasound2 \
    libpangocairo-1.0-0 \
    libgtk-3-0 \
    --no-install-recommends

# 3. Définir le dossier de travail
WORKDIR /app

# 4. Copier les fichiers package.json et package-lock.json pour optimiser le cache
COPY package*.json ./

# 5. Installer les dépendances (inclus Puppeteer)
RUN npm install

# 6. Copier le reste des fichiers du projet
COPY . .

# 7. Compiler TypeScript
# RUN npm run build

# 8. Définir les variables d'environnement pour Puppeteer
ENV PUPPETEER_EXECUTABLE_PATH="/usr/bin/chromium-browser" \
    PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

# 9. Exposer le port (optionnel, si ton bot a un serveur HTTP)
EXPOSE 3000

# 10. Commande pour démarrer l'application
CMD ["npm", "run", "start2"]
