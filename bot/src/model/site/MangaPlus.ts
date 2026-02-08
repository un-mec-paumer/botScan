import { SiteManga } from "../site";
import Manga from "../manga";
import { Browser } from "puppeteer-core";
import { getCherrioText } from "../../function";

export default class MangaPlus implements SiteManga {
    name = "MangaPlus";
    link = "https://mangaplus.shueisha.co.jp";

    idMangaPlus: { [key: number]: string } = {
        64: '700023',
        52: '700005',
        70: '700036'
    }

    async visitSiteManga(browser: Browser, manga: Manga): Promise<{tabChap: number[], linkManga: string}> {
        const url = `${this.link}/titles/${this.idMangaPlus[manga.id]}`
        const $ = await getCherrioText(url, browser);

        const newChap = $(".ChapterListItem-module_name_3h9dj").toArray().map((element) => { 
            const text = $(element).text();
            return parseFloat(text.replace("#", "").trim());
        }).filter((nbChap) => {
            return nbChap > manga.chapitre
        });

        // console.log(`MangaPlus: Found new chapters for ${manga.name}: ${newChap}`);
        
        return {tabChap: newChap, linkManga: url};
    }
}

