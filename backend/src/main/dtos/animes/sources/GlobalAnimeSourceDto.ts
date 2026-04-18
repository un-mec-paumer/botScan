import { z } from 'zod';

export const GlobalAnimeSourceDto = z.object({
    id: z.number().int(),
    name: z.string(),
    domainUrl: z.string(),
});

export type GlobalAnimeSourceDtoType = z.infer<typeof GlobalAnimeSourceDto>;
