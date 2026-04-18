import { ModelManga } from "@models/Manga";
import { ModelAnime } from "@models/Anime";

// TODO: ne plus utiliser, restent ici pour garder la logique avec les autres fichiers à cet endroit
interface ModelSource {
    mangaSource: {id: number, name: string}
}

export interface ModelSourceManga extends ModelSource {
    visitSiteManga(manga: ModelManga): Promise<{tabChap: number[], linkManga: string}>;
}

export interface ModelSourceAnime extends ModelSource {
    visitSiteAnime(anime: ModelAnime): Promise<{tabChap: number[], linkManga: string}>;
}