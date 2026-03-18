import { z } from 'zod';

export const SourceDto = z.object({
    id: z.number().int(),
    name: z.string(),
});

export type SourceDtoType = z.infer<typeof SourceDto>;
