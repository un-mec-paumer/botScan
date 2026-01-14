import dotenv from 'dotenv';
dotenv.config()
export const animeSamaUrl = process.env.ANIME_SAMA_URL!;
export const TOKEN = process.env.TOKEN!;
export const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;
export const BROWSER_PATH = process.env.CHROME_PATH!;
export const DEV = process.env.DEV!;
export const SUPABASE_URL = process.env.SUPABASE_URL!;
export const SUPABASE_KEY = process.env.SUPABASE_KEY!;
export const SUPABASE_EMAIL = process.env.SUPABASE_EMAIL!;
export const SUPABASE_PASSWORD = process.env.SUPABASE_PASSWORD!;
