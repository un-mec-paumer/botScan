import { Browser } from "puppeteer-core";
import Manga from "./manga";

export default interface Site {
    name: string;
    link: string;
    visitSite(browser: Browser, manga:Manga): Promise<{tabChap: number[], linkManga: string}>;
}