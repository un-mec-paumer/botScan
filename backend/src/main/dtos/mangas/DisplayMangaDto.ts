import { z } from 'zod';
import { MangaSourceDto } from '@dtos/mangas/sources/MangaSourceDto';

export const DisplayMangaDto = z.object({
    id: z.number().int(),
    name: z.string(),
    synopsis: z.string(),
    imgUrl: z.string(),
    chapter: z.string(),
    mangaSources: z.array(MangaSourceDto),
});

export type DisplayMangaDtoType = z.infer<typeof DisplayMangaDto>;
