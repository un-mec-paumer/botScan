import { Anime } from "@prisma/client";
import { ModelAnimeSource } from "./AnimeSource";
import { DisplayAnimeDtoType } from "@dtos/animes/DisplayAnimeDto";

export class ModelAnime {
    id: number;
    name: string;
    synopsis: string | null;
    imgUrl: string | null;
    season: string | null;
    episode: string | null;
    // language: string | null; //TODO: peut-être ajouter des langues dans le futur
    sources: ModelAnimeSource[];

    constructor(data: Anime, sources: ModelAnimeSource[] = []) {
        this.id = data.id;
        this.name = data.name;
        this.synopsis = data.synopsis;
        this.imgUrl = data.imgUrl;
        this.season = data.season;
        // this.language = data.language;
        this.episode = data.episode;
        this.sources = sources;
    }
    
    display(): DisplayAnimeDtoType {
        return {
            id: this.id,
            name: this.name,
            synopsis: this.synopsis ?? "",
            imgUrl: this.imgUrl ?? "",
            season: this.season ?? "",
            episode: this.episode ?? "",
            sources: this.sources.map(source => source.display())
        };
    }
}
