import { z } from 'zod';

export const MangaSourceDto = z.object({
    id: z.number().int(),
    name: z.string(),
});

export type MangaSourceDtoType = z.infer<typeof MangaSourceDto>;
