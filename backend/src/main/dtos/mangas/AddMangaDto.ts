import { z } from 'zod';

export const AddMangaDto = z
  .object({
    name: z.string(),
    synospis: z.string(),
    imgUrl: z.string(),
    source: z.string(),
    chapter: z.string(),
  });

export type AddMangaDtoType = z.infer<typeof AddMangaDto>;
