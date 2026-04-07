import { z } from 'zod';

export const AddMangaAlertDto = z.object({
    mangaId: z.number().int(),
    userId: z.string().uuid(),
});

export type AddMangaAlertDtoType = z.infer<typeof AddMangaAlertDto>;
