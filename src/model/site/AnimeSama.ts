import Site from "../site";
import Manga from "../manga";
import { Page } from "puppeteer-core";
import { getCherrioText } from "../../function";
import { animeSamaUrl } from "../../variables";


export default class AnimeSama implements Site {
    name = "Anime-Sama";
    link = animeSamaUrl!;


    async visitSite(page: Page, manga: Manga): Promise<{tabChap: number[], linkManga: string}> {

        const $ = await getCherrioText(manga.getLink(), page);

        const newChap = $("#selectChapitres option").toArray().map((element) => { console.log($(element).text().trim());return $(element).attr("value") }).filter((element) => {
            const nbChap = parseFloat(element!.split(" ")[1])
            // console.log(`Found chapter option: ${element}, parsed chapter number: ${nbChap}`);
            return nbChap > manga.chapitre_manga
        }).map((element) => { return parseFloat(element!.split(" ")[1]) });

        // console.log(`${this.name}: Found new chapters for ${manga.name_manga}: ${newChap}`);
        return {tabChap: newChap, linkManga: manga.getLink()};
    }
}