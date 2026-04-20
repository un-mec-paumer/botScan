import { z } from 'zod';

export const AddMangaDto = z.object({
    name: z.string(),
    synospis: z.string(),
    imgUrl: z.string(),
    chapter: z.string(),
    globalSourceId: z.number().int(),
    link: z.string().optional(),
});

export type AddMangaDtoType = z.infer<typeof AddMangaDto>;
