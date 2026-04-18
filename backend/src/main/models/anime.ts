import { Anime } from "@prisma/client";
import { ModelSourceAnime } from "@models/site/source";

export class ModelAnime {
    id: number;
    name: string;
    synospis: string | null;
    imgUrl: string | null;
    season: string | null;
    // language: string | null; //TODO: peut-être ajouter des langues dans le futur
    episode: string | null;
    sources: ModelSourceAnime[];

    constructor(data: Anime, sources: ModelSourceAnime[] = []) {
        this.id = data.id;
        this.name = data.name;
        this.synospis = data.synopsis;
        this.imgUrl = data.imgUrl;
        this.season = data.season;
        // this.language = data.language;
        this.episode = data.episode;
        this.sources = sources;
    }
}
