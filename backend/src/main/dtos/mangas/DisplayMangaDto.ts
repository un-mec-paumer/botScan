import { z } from 'zod';
import { GlobalMangaSourceDto } from '@dtos/mangas/sources/GlobalMangaSourceDto';

export const DisplayMangaDto = z.object({
    id: z.number().int(),
    name: z.string(),
    synopsis: z.string(),
    imgUrl: z.string(),
    chapter: z.string(),
    sources: z.array(GlobalMangaSourceDto),
});

export type DisplayMangaDtoType = z.infer<typeof DisplayMangaDto>;
