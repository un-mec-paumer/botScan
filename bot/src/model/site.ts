import Manga from "./manga";

interface Site {
    name: string;
    link: string;
}

export interface SiteManga extends Site {
    visitSiteManga(manga:Manga): Promise<{tabChap: number[], linkManga: string}>;
}

export interface SiteAnime extends Site {
    visitSiteAnime(anime:any): Promise<{tabChap: number[], linkManga: string}>;
}