import { z } from 'zod';

export const DisplayGlobalMangaSourceDto = z.object({
    id: z.number().int(),
    name: z.string(),
    domainUrl: z.string(),
});

export type DisplayGlobalMangaSourceDtoType = z.infer<typeof DisplayGlobalMangaSourceDto>;
