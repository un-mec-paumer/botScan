import { z } from 'zod';
import { DisplayAnimeDto } from '../DisplayAnimeDto';
import { DisplayUserDto } from '../../users/DisplayUserDto';

export const DisplayAnimeAlertDto = z.object({
    anime: DisplayAnimeDto.optional(),
    user: DisplayUserDto.optional(),
});

export type DisplayAnimeAlertDtoType = z.infer<typeof DisplayAnimeAlertDto>;
