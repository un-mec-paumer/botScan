import { z } from 'zod';

export const DisplayAnimeDto = z.object({
    id: z.number().int(),
    name: z.string(),
    synospis: z.string(),
    imgUrl: z.string(),
    season: z.string(),
    language: z.string(), //TODO: peut-être ajouter des langues dans le futur
    episode: z.string(),
});

export type DisplayAnimeDtoType = z.infer<typeof DisplayAnimeDto>;
