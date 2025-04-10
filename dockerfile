# 1. Utilisation d'une image légère de Node.js
FROM node:22-slim

# 2. Installation des dépendances système nécessaires à Puppeteer
RUN apt-get update && apt-get install -y \
    wget \
    chromium \
    xdg-utils \
    --no-install-recommends && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

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
ENV PUPPETEER_EXECUTABLE_PATH="/usr/bin/chromium" \
    PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    CHROME_DEVEL_SANDBOX="/usr/local/sbin/chrome-devel-sandbox"

# 9. Exposer le port (optionnel, si ton bot a un serveur HTTP)
EXPOSE 3001

# 10. Commande pour démarrer l'application
CMD ["npm", "run", "start2"]
