import { AnimeSource } from "@prisma/client";
import { ModelAnime } from "@models/Anime";
import { ModelGlobalAnimeSource } from "./GlobalAnimeSource";

export class ModelAnimeSource {
    link: string;
    anime: ModelAnime | null;
    globalSource: ModelGlobalAnimeSource | null;

    constructor(data: AnimeSource, anime: ModelAnime | null = null, globalSource: ModelGlobalAnimeSource | null = null) {
        this.link = data.link;
        this.anime = anime;
        this.globalSource = globalSource;
    }
}
