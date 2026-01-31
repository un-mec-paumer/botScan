import { Browser } from "puppeteer-core";
import Manga from "./manga";

interface Site {
    name: string;
    link: string;
}

export interface SiteManga extends Site {
    visitSiteManga(browser: Browser, manga:Manga): Promise<{tabChap: number[], linkManga: string}>;
}

export interface SiteAnime extends Site {
    visitSiteAnime(browser: Browser, anime:any): Promise<{tabChap: number[], linkManga: string}>;
}