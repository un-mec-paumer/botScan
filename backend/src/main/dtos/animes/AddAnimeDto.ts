import { z } from 'zod';

export const AddAnimeDto = z.object({
    name: z.string(),
    synospis: z.string(),
    imgUrl: z.string(),
    // source: z.string(),
    season: z.string(),
    episode: z.string(),
});

export type AddAnimeDtoType = z.infer<typeof AddAnimeDto>;
