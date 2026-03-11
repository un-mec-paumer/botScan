import { z } from 'zod';

export const DisplayMangaDto = z.object({
    id: z.number().int(),
    name: z.string(),
    synospis: z.string(),
    imgUrl: z.string(),
    source: z.string(),
    chapter: z.string(),
});

export type DisplayMangaDtoType = z.infer<typeof DisplayMangaDto>;
