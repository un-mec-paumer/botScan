import { z, ZodObject } from 'zod';

export const DisplayGlobalAnimeSourceDto = z.object({
    id: z.number().int(),
    name: z.string(),
    domainUrl: z.string(),
}) as ZodObject;

export type DisplayGlobalAnimeSourceDtoType = z.infer<typeof DisplayGlobalAnimeSourceDto>;
