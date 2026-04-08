import { PrismaClient } from '@prisma/client';
import fs from 'node:fs';

const prisma = new PrismaClient();

export default async function seedDatabase() {
    const sql = fs.readFileSync('../prisma/seed.sql', 'utf-8');

    // TODO : make seeder like prisma good practice
    try {
        await prisma.$executeRawUnsafe(`BEGIN`);
        await prisma.$executeRawUnsafe(sql);
        await prisma.$executeRawUnsafe(`COMMIT`);
    } catch (error) {
        await prisma.$executeRawUnsafe(`ROLLBACK`);
        console.error(error);
    }
}

seedDatabase();
