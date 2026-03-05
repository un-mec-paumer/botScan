import { z } from 'zod';
import { DisplayMangaDto } from '../mangas/DisplayMangaDto';
import { DisplayUserDto } from '../users/DisplayUserDto';

export const DisplayAlertDto = z
  .object({
    work: DisplayMangaDto,
    user: DisplayUserDto,
    mangaAlert: z.boolean(),
    animeAlert: z.boolean(),
  });

export type DisplayAlertDtoType = z.infer<typeof DisplayAlertDto>;
