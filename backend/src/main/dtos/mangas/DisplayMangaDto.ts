import { z } from 'zod';
import { SourceDtoInterfaceManga, SourceDtoType, SourceDto } from '@dtos/source/source';

import AnimeSama from '@dtos/source/AnimeSama';
import MangaMoins from '@dtos/source/MangaMoins';
import MangaPlus from '@dtos/source/MangaPlus';

export const DisplayMangaDto = z.object({
    id: z.number().int(),
    name: z.string(),
    synopsis: z.string(),
    imgUrl: z.string(),
    // source: z.string(),
    chapter: z.string(),
    mangaSources: z.array(
        z.object({
            mangaSource: SourceDto
        })
    ),
});

export type DisplayMangaDtoType = z.infer<typeof DisplayMangaDto>;

export class DisplayMangaDtoClass implements DisplayMangaDtoType {
    id: number;
    name: string;
    synopsis: string;
    imgUrl: string;
    chapter: string;
    mangaSources: {
        mangaSource: SourceDtoInterfaceManga;
    }[];

    constructor(data: DisplayMangaDtoType) {
        this.id = data.id;
        this.name = data.name;
        this.synopsis = data.synopsis;
        this.imgUrl = data.imgUrl;
        this.chapter = data.chapter;
        this.mangaSources = data.mangaSources.map((data) => this.mangaSourcesFactory(data.mangaSource));
    }

    public async visiteAllSite() : Promise<{tabChap: number[], linkManga: string}> {
        const results = await Promise.all(this.mangaSources.map(({ mangaSource }) => mangaSource.visitSiteManga(this)));
        const resultFinal = results.filter((result) => result.tabChap.length > 0).sort((a, b) => b.tabChap[b.tabChap.length - 1] - a.tabChap[a.tabChap.length - 1]);
        if (resultFinal.length > 0) return resultFinal[0];
        else return {tabChap: [], linkManga: ""};
    }

    private mangaSourcesFactory(source: SourceDtoType): {mangaSource: SourceDtoInterfaceManga} {
        switch (source.name) {
            case "AnimeSama":
                return { mangaSource: new AnimeSama(source) };
            case "MangaMoins":
                return { mangaSource: new MangaMoins(source) };
            case "MangaPlus":
                return { mangaSource: new MangaPlus(source) };
            default:
                return { mangaSource: new AnimeSama(source) }; // TODO: throw an error or return a default source instead of AnimeSama
        }
    }
}
