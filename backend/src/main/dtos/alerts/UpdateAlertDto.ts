import { z } from 'zod';

export const UpdateAlertDto = z.object({
    workId: z.number().int(),
    userId: z.string().uuid(),
    mangaAlert: z.boolean().optional(),
    animeAlert: z.boolean().optional(),
});

export type UpdateAlertDtoType = z.infer<typeof UpdateAlertDto>;
