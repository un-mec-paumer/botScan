import { z } from 'zod';
import { DisplayMangaDtoClass } from '@dtos/mangas/DisplayMangaDto';
import { DisplayAnimeDtoType } from '@dtos/animes/DisplayAnimeDto';

export const SourceDto = z.object({
    id: z.number().int(),
    name: z.string(),
});

export type SourceDtoType = z.infer<typeof SourceDto>;

export interface SourceDtoInterfaceManga extends SourceDtoType {
    visitSiteManga(manga: DisplayMangaDtoClass): Promise<{tabChap: number[], linkManga: string}>;
}

export interface SourceDtoInterfaceAnime extends SourceDtoType {
    visitSiteAnime(anime: DisplayAnimeDtoType): Promise<{tabChap: number[], linkManga: string}>;
}