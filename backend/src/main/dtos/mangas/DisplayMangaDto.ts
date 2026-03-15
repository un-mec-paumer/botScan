import { z } from 'zod';

export const DisplayMangaDto = z.object({
    id: z.number().int(),
    name: z.string(),
    synopsis: z.string(),
    imgUrl: z.string(),
    // source: z.string(),
    chapter: z.string(),
    mangaSources: z.array(
        z.object({
            mangaSource: z.object({
                id: z.number().int(), 
                name: z.string(),
            }),
        })
    ),
});

export type DisplayMangaDtoType = z.infer<typeof DisplayMangaDto>;
