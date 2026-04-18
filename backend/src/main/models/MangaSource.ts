import { MangaSource } from "@prisma/client";
import { ModelManga } from "@models/Manga";
import { ModelGlobalMangaSource } from "./GlobalMangaSource";
import { DisplayMangaSourceDtoType } from "@dtos/mangas/sources/DisplayMangaSourceDto";

export class ModelMangaSource {
    link: string;
    manga: ModelManga | null;
    globalSource: ModelGlobalMangaSource | null;

    constructor(data: MangaSource, manga: ModelManga | null = null, globalSource: ModelGlobalMangaSource | null = null) {
        this.link = data.link;
        this.manga = manga;
        this.globalSource = globalSource;
    }

    display(): DisplayMangaSourceDtoType {
        return {
            link: this.link,
            manga: this.manga?.display(),
            globalSource: this.globalSource?.display()
        }
    }
}
