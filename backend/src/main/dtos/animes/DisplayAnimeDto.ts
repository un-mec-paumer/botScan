import { z } from 'zod';
import { GlobalAnimeSourceDto } from './sources/GlobalAnimeSourceDto';

export const DisplayAnimeDto = z.object({
    id: z.number().int(),
    name: z.string(),
    synopsis: z.string(),
    imgUrl: z.string(),
    season: z.string(),
    language: z.string(), // TODO: peut-être ajouter des langues dans le futur
    episode: z.string(),
    sources: z.array(GlobalAnimeSourceDto),
});

export type DisplayAnimeDtoType = z.infer<typeof DisplayAnimeDto>;
