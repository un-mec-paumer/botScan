import { z } from 'zod';

export const GlobalMangaSourceDto = z.object({
    id: z.number().int(),
    name: z.string(),
    domainUrl: z.string(),
});

export type GlobalMangaSourceDtoType = z.infer<typeof GlobalMangaSourceDto>;
