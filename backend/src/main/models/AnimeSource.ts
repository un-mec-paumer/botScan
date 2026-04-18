import { AnimeSource } from "@prisma/client";
import { ModelAnime } from "@models/Anime";
import { ModelGlobalAnimeSource } from "./GlobalAnimeSource";
import { DisplayAnimeSourceDtoType } from "@dtos/animes/sources/DisplayAnimeSourceDto";

export class ModelAnimeSource {
    link: string;
    anime: ModelAnime | null;
    globalSource: ModelGlobalAnimeSource | null;

    constructor(data: AnimeSource, anime: ModelAnime | null = null, globalSource: ModelGlobalAnimeSource | null = null) {
        this.link = data.link;
        this.anime = anime;
        this.globalSource = globalSource;
    }
    
    display(): DisplayAnimeSourceDtoType {
        return {
            link: this.link,
            anime: this.anime?.display(),
            globalSource: this.globalSource?.display()
        }
    }
}
