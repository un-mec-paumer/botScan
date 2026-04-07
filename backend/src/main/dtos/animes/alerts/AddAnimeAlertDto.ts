import { z } from 'zod';

export const AddAnimeAlertDto = z.object({
    animeId: z.number().int(),
    userId: z.string().uuid(),
});

export type AddAnimeAlertDtoType = z.infer<typeof AddAnimeAlertDto>;
