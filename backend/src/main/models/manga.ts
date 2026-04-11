import { ModelSourceManga } from "@models/source/source";
import { MangaSourceDtoType } from "@dtos/mangas/sources/MangaSourceDto";
import { DisplayMangaDtoType } from "@dtos/mangas/DisplayMangaDto";

import AnimeSama from '@models/source/site/AnimeSama';
import MangaMoins from '@models/source/site/MangaMoins';
import MangaPlus from '@models/source/site/MangaPlus';

export class ModelManga {
    id: number;
    name: string;
    synopsis: string;
    imgUrl: string;
    chapter: string;
    mangaSources: ModelSourceManga[];

    constructor(data: DisplayMangaDtoType) {
        this.id = data.id;
        this.name = data.name;
        this.synopsis = data.synopsis;
        this.imgUrl = data.imgUrl;
        this.chapter = data.chapter;
        this.mangaSources = data.mangaSources.map((source) => this.mangaSourcesFactory(source));
    }

    public async visiteAllSite() : Promise<{tabChap: number[], linkManga: string}> {
        const results = await Promise.all(this.mangaSources.map((mangaSource) => mangaSource.visitSiteManga(this)));
        
        const resultFinal = results.filter((result) => result.tabChap.length > 0).sort((a, b) => b.tabChap[b.tabChap.length - 1] - a.tabChap[a.tabChap.length - 1]);
        
        if (resultFinal.length > 0) return resultFinal[0];
        
        else return {tabChap: [], linkManga: ""};
    }

    private mangaSourcesFactory(source: MangaSourceDtoType): ModelSourceManga {
        switch (source.mangaSource.name) {
            case "AnimeSama":
                return new AnimeSama(source);
            case "MangaMoins":
                return new MangaMoins(source);
            case "MangaPlus":
                return new MangaPlus(source);
            default:
                return new AnimeSama(source); // TODO: throw an error or return a default source instead of AnimeSama
        }
    }
}
