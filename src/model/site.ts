import { Page } from "puppeteer-core";
import Manga from "./manga";

export default interface Site {
    name: string;
    link: string;
    visitSite(page:Page, manga:Manga): Promise<{tabChap: number[], linkManga: string}>;
}