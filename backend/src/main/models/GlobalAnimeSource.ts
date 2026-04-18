import { GlobalAnimeSource } from "@prisma/client";
import { ModelAnimeSource } from "./AnimeSource";
import { DisplayGlobalAnimeSourceDtoType } from "@dtos/animes/sources/DisplayGlobalAnimeSourceDto";
import AnimeSama from '@models/site/AnimeSama';

export class ModelGlobalAnimeSource {
    id: number;
    name: string;
    domainUrl: string;
    sources: ModelAnimeSource[];

    public constructor(data: GlobalAnimeSource, sources: ModelAnimeSource[] = []) {
        this.id = data.id;
        this.name = data.name;
        this.domainUrl = data.domainUrl;
        this.sources = sources;
    }
    
    display(): DisplayGlobalAnimeSourceDtoType {
        return {
            id: this.id,
            name: this.name,
            domainUrl: this.domainUrl
        }
    }

    // private animeSourcesFactory(source: ModelAnimeSource): ModelAnimeSource {
    //     switch (this.name) {
    //         case "AnimeSama":
    //             return new AnimeSama(this);
    //         default:
    //             return new AnimeSama(this); // TODO: throw an error or return a default source instead of AnimeSama
    //     }
    // }
}
