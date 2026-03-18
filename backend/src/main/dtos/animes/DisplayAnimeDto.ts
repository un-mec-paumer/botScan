import { z } from 'zod';

export const DisplayAnimeDto = z.object({
    id: z.number().int(),
    name: z.string(),
    synospis: z.string(),
    imgUrl: z.string(),
    // source: z.string(),
    season: z.string(),
    language: z.string(), // peut etre ajouté des langues 
    episode: z.string(),
});

export type DisplayAnimeDtoType = z.infer<typeof DisplayAnimeDto>;
