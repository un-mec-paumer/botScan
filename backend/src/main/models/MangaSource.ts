import { MangaSource } from "@prisma/client";
import { ModelManga } from "@models/Manga";
import { ModelGlobalMangaSource } from "./GlobalMangaSource";

export class ModelMangaSource {
    link: string;
    manga: ModelManga | null;
    globalSource: ModelGlobalMangaSource | null;

    constructor(data: MangaSource, manga: ModelManga | null = null, globalSource: ModelGlobalMangaSource | null = null) {
        this.link = data.link;
        this.manga = manga;
        this.globalSource = globalSource;
    }
}
