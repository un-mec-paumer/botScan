import { ModelManga } from "@models/manga";
import { ModelAnime } from "@models/anime";

interface ModelSource {
    id: number;
    name: string;
}

// Wtf is this ???
export interface ModelSourceManga extends ModelSource {
    visitSiteManga(manga: ModelManga): Promise<{tabChap: number[], linkManga: string}>;
}

export interface ModelSourceAnime extends ModelSource {
    visitSiteAnime(anime: ModelAnime): Promise<{tabChap: number[], linkManga: string}>;
}