import { ModelManga } from "@models/works/manga";
import { ModelAnime } from "@models/works/anime";

interface ModelSource {
    id: number;
    name: string;
}

export interface ModelSourceManga extends ModelSource {
    visitSiteManga(manga: ModelManga): Promise<{tabChap: number[], linkManga: string}>;
}

export interface ModelSourceAnime extends ModelSource {
    visitSiteAnime(anime: ModelAnime): Promise<{tabChap: number[], linkManga: string}>;
}