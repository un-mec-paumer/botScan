import { DisplayAnimeDtoType } from "@dtos/animes/DisplayAnimeDto";
import { AnimeSourceDtoType } from "@dtos/animes/sources/AnimeSourceDto";

import { ModelSourceAnime } from "@models/source/source";
import AnimeSama from "@models/source/site/AnimeSama";
import MangaMoins from "@models/source/site/MangaMoins";
import MangaPlus from "@models/source/site/MangaPlus";


export class ModelAnime {
    id: number;
    name: string;
    synospis: string;
    imgUrl: string;
    sources: ModelSourceAnime[];
    season: string;
    language: string; //TODO: peut-être ajouter des langues dans le futur
    episode: string;

    constructor(data: DisplayAnimeDtoType) {
        this.id = data.id;
        this.name = data.name;
        this.synospis = data.synospis;
        this.imgUrl = data.imgUrl;
        this.season = data.season;
        this.language = data.language;
        this.episode = data.episode;

        // TODO: pour le moment on a que AnimeSama, mais il faudra ajouter les autres sources et faire une factory propre
        this.sources =  [{id: 1, name: "AnimeSama"}].map(this.animeSourcesFactory);
    }

    private animeSourcesFactory(source: AnimeSourceDtoType): ModelSourceAnime {
        switch (source.name) {
            case "AnimeSama":
                return new AnimeSama(source);
            default:
                return new AnimeSama(source); // TODO: throw an error or return a default source instead of AnimeSama
        }
    }
}