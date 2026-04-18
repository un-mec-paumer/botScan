import { ModelManga } from "@models/Manga";
import { ModelAnime } from "@models/Anime";

interface ModelSource { // je sais que c'est moche 
    // id: number; // le pb c'est que le model prisma renvoie les donnees comme ca
    // name: string; // et que si on dévie juste un peu c'est erreur de deserilization a gogo
    // link: string; // soit on change le model prisma pour que ca corresponde a ce qu'on veut, soit on fait du moche comme ca
    mangaSource: {id: number, name: string}
}

// Wtf is this ??? // tkt c'est du typage pour pas que se soit moche
export interface ModelSourceManga extends ModelSource {
    visitSiteManga(manga: ModelManga): Promise<{tabChap: number[], linkManga: string}>;
}

export interface ModelSourceAnime extends ModelSource {
    visitSiteAnime(anime: ModelAnime): Promise<{tabChap: number[], linkManga: string}>;
}