import { z } from 'zod';

export const AnimeSourceDto = z.object({
    id: z.number().int(),
    name: z.string(),
});

export type AnimeSourceDtoType = z.infer<typeof AnimeSourceDto>;
