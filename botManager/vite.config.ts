import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config();

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
    ],
    server: {
        port: Number(process.env.PORT) || 3000,
        open: true,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET POST',
            'Access-Control-Allow-Headers': '*',
        },
    },
    build: {
        manifest: true,
        rollupOptions: {

            input: {
                index: path.resolve(path.join(__dirname, "/html/index.html")),
                profil: path.resolve(path.join(__dirname, "/html/profil.html")),
                contact: path.resolve(path.join(__dirname, "/html/contact.html")),
                signIn: path.resolve(path.join(__dirname, "/html/signIn.html")),
                manga: path.resolve(path.join(__dirname, "/html/manga.html")),
                addmanga: path.resolve(path.join(__dirname, "/html/addmanga.html")),
            },
        },
    },

})
