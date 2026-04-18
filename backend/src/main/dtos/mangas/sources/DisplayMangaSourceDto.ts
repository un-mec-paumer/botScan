import { z, ZodObject } from 'zod';
import { DisplayMangaDto } from '../DisplayMangaDto';
import { DisplayGlobalMangaSourceDto } from './DisplayGlobalMangaSourceDto';

export const DisplayMangaSourceDto = z.object({
    link: z.string(),
    globalSource: DisplayGlobalMangaSourceDto.optional(),
    manga: z.lazy(() => DisplayMangaDto).optional(),
}) as ZodObject;

export type DisplayMangaSourceDtoType = z.infer<typeof DisplayMangaSourceDto>;
