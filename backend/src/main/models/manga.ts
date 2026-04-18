import { Manga } from "@prisma/client";
import { ModelMangaSource } from "./MangaSource";
import { DisplayMangaDtoType } from "@dtos/mangas/DisplayMangaDto";

export class ModelManga {
    id: number;
    name: string;
    synopsis: string | null;
    imgUrl: string | null;
    chapter: string | null;
    sources: ModelMangaSource[];

    constructor(data: Manga, sources: ModelMangaSource[] = []) {
        this.id = data.id;
        this.name = data.name;
        this.synopsis = data.synopsis;
        this.imgUrl = data.imgUrl;
        this.chapter = data.chapter;
        this.sources = sources;
    }

    display(): DisplayMangaDtoType {
        return {
            id: this.id,
            name: this.name,
            synopsis: this.synopsis ?? "",
            imgUrl: this.imgUrl ?? "",
            chapter: this.chapter ?? "",
            sources: this.sources.map(source => source.display())
        };
    }

    // public async visiteAllSite() : Promise<{tabChap: number[], linkManga: string}> {
    //     const results = await Promise.all(this.mangaSources.map((mangaSource) => mangaSource.visitSiteManga(this)));
        
    //     const resultFinal = results.filter((result) => result.tabChap.length > 0).sort((a, b) => b.tabChap[b.tabChap.length - 1] - a.tabChap[a.tabChap.length - 1]);
        
    //     if (resultFinal.length > 0) return resultFinal[0];
        
    //     else return {tabChap: [], linkManga: ""};
    // }
}
