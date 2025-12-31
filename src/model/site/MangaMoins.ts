import Site from "../site";
import Manga from "../manga";
import { Page } from "puppeteer-core";
import { getCherrioText } from "../../function";
export default class MangaMoins implements Site {
    name = "MangaMoins";
    link = "https://mangamoins.com/";
    
    async visitSite(page: Page, manga: Manga): Promise<{tabChap: number[], linkManga: string}> {
        
        const $ = await getCherrioText(this.link, page);

        const newChap = $('.sortie').toArray().filter((element) => { 
            return $(element).text().toLocaleLowerCase().includes(manga.name_manga.replaceAll('-', ' '));
        }).map((element) => {
            const text = $(element).find('h3').text();
            return parseFloat(text.replace('#', "").trim());
        }).filter((nbChap) => {
            return nbChap > manga.chapitre_manga
        });

        // console.log(`MangaMoins: Found new chapters for ${manga.name_manga}: ${newChap}`);
        
        return {tabChap: newChap, linkManga: this.link};
    }
}