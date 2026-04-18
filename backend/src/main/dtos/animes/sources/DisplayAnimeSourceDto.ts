import { z, ZodObject } from 'zod';
// import { DisplayAnimeDto } from '../DisplayAnimeDto';
import { DisplayGlobalAnimeSourceDto } from './DisplayGlobalAnimeSourceDto';

export const DisplayAnimeSourceDto = z.object({
    link: z.string(),
    globalSource: DisplayGlobalAnimeSourceDto.optional(),
    // anime: z.lazy(() => DisplayAnimeDto).optional(),
}) as ZodObject;

export type DisplayAnimeSourceDtoType = z.infer<typeof DisplayAnimeSourceDto>;
