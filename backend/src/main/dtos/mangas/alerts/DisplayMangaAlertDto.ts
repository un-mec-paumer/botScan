import { z } from 'zod';
import { DisplayMangaDto } from '../DisplayMangaDto';
import { DisplayUserDto } from '../../users/DisplayUserDto';

export const DisplayMangaAlertDto = z.object({
    manga: DisplayMangaDto,
    user: DisplayUserDto,
});

export type DisplayMangaAlertDtoType = z.infer<typeof DisplayMangaAlertDto>;
