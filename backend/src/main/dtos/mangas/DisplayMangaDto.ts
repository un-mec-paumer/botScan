import { z, ZodObject } from 'zod';
import { DisplayMangaSourceDto } from './sources/DisplayMangaSourceDto';

export const DisplayMangaDto = z.object({
    id: z.number().int(),
    name: z.string(),
    synopsis: z.string(),
    imgUrl: z.string(),
    chapter: z.string(),
    sources: z.array(DisplayMangaSourceDto),
}) as ZodObject;

export type DisplayMangaDtoType = z.infer<typeof DisplayMangaDto>;
