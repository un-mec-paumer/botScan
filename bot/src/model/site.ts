import { Browser } from "puppeteer-core";
import Manga from "./manga";

interface site {
    name: string;
    link: string;
}

export interface SiteManga extends site {
    visitSiteManga(browser: Browser, manga:Manga): Promise<{tabChap: number[], linkManga: string}>;
}

export interface SiteAnime extends site {
    visitSiteAnime(browser: Browser, anime:any): Promise<{tabChap: number[], linkManga: string}>;
}