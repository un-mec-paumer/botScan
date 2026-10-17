import { ModelAnime } from "@models/anime";
import { ModelManga } from "@models/manga";

// TODO: ne plus utiliser, restent ici pour garder la logique avec les autres fichiers à cet endroit
interface ModelSource {
    mangaSource: {id: number, name: string, domainUrl: string};
}

export interface ModelSourceManga extends ModelSource {
    visitSiteManga(manga: ModelManga, link: string): Promise<{tabChap: number[], linkManga: string}>;
}

export interface ModelSourceAnime extends ModelSource {
    visitSiteAnime(anime: ModelAnime, link: string): Promise<{tabChap: number[], linkManga: string}>;
}