import { DisplayAnimeDtoType } from "@dtos/animes/DisplayAnimeDto";
import { SourceDtoType } from "@dtos/source/sourceDto";

import { ModelSourceAnime } from "@models/source/source";
import AnimeSama from "@models/source/site/AnimeSama";
import MangaMoins from "@models/source/site/MangaMoins";
import MangaPlus from "@models/source/site/MangaPlus";


export class ModelAnime {
    id: number;
    name: string;
    synospis: string;
    imgUrl: string;
    animeSources: {
        mangaSource: ModelSourceAnime;
    }[];
    season: string;
    language: string; // peut etre ajouté des langues 
    episode: string;

    constructor(data: DisplayAnimeDtoType) {
        this.id = data.id;
        this.name = data.name;
        this.synospis = data.synospis;
        this.imgUrl = data.imgUrl;
        // this.source = data.source;
        this.season = data.season;
        this.language = data.language;
        this.episode = data.episode;

        // TODO: pour le moment on a que AnimeSama, mais il faudra ajouter les autres sources et faire une factory propre
        this.animeSources =  [{mangaSource: {id: 1, name: "AnimeSama"}}].map((data) => this.animeSourcesFactory(data.mangaSource));
    }

    private animeSourcesFactory(source: SourceDtoType): {mangaSource: ModelSourceAnime} {
        switch (source.name) {
            case "AnimeSama":
                return { mangaSource: new AnimeSama(source) };
            default:
                return { mangaSource: new AnimeSama(source) }; // TODO: throw an error or return a default source instead of AnimeSama
        }
    }
}