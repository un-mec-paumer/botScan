import { GlobalMangaSource } from "@prisma/client";
import { ModelMangaSource } from "./MangaSource";
import { DisplayGlobalMangaSourceDtoType } from "@dtos/mangas/sources/DisplayGlobalMangaSourceDto";
import AnimeSama from '@models/site/AnimeSama';
import MangaMoins from '@models/site/MangaMoins';
import MangaPlus from '@models/site/MangaPlus';

export class ModelGlobalMangaSource {
    id: number;
    name: string;
    domainUrl: string;
    sources: ModelMangaSource[];

    public constructor(data: GlobalMangaSource, sources: ModelMangaSource[] = []) {
        this.id = data.id;
        this.name = data.name;
        this.domainUrl = data.domainUrl;
        this.sources = sources;
    }

    display(): DisplayGlobalMangaSourceDtoType {
        return {
            id: this.id,
            name: this.name,
            domainUrl: this.domainUrl
        }
    }

    // private mangaSourcesFactory(source: ModelMangaSource): ModelMangaSource {
    //     switch (this.name) {
    //         case "AnimeSama":
    //             return new AnimeSama(this);
    //         case "MangaMoins":
    //             return new MangaMoins(this);
    //         case "MangaPlus":
    //             return new MangaPlus(this);
    //         default:
    //             return new AnimeSama(this); // TODO: throw an error or return a default source instead of AnimeSama
    //     }
    // }
}
