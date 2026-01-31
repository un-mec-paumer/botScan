import { SiteManga, SiteAnime} from "../site";
import Manga from "../manga";
import Anime from "../anime";
import { Browser } from "puppeteer-core";
import { getCherrioText } from "../../function";
import { animeSamaUrl } from "../../variables";


export default class AnimeSama implements SiteManga, SiteAnime {
    name = "Anime-Sama";
    link = animeSamaUrl!;


    async visitSiteManga(browser: Browser, manga: Manga): Promise<{tabChap: number[], linkManga: string}> {

        const $ = await getCherrioText(manga.getLink(), browser);

        const newChap = $("#selectChapitres option").toArray().map((element) => { return $(element).attr("value") }).filter((element) => {
            const nbChap = parseFloat(element!.split(" ")[1])
            // console.log(`Found chapter option: ${element}, parsed chapter number: ${nbChap}`);
            return nbChap > manga.chapitre_manga
        }).map((element) => { return parseFloat(element!.split(" ")[1]) });

        // console.log(`${this.name}: Found new chapters for ${manga.name_manga}: ${newChap}`);
        return {tabChap: newChap, linkManga: manga.getLink()};
    }

    async visitSiteAnime(browser: Browser, anime: Anime): Promise<{tabChap: number[], linkManga: string}> {
        const $ = await getCherrioText(anime.getLink(), browser);

        const newEp = $("#selectEpisodes option").toArray().map((element) => { return $(element).attr("value") }).filter((element) => {
            const nbEp = parseFloat(element!.split(" ")[1])
            // console.log(`Found chapter option: ${element}, parsed chapter number: ${nbChap}`);
            return nbEp > anime.episode
        }).map((element) => { return parseFloat(element!.split(" ")[1]) });

        // console.log(`${this.name}: Found new chapters for ${manga.name_manga}: ${newChap}`);
        return {tabChap: newEp, linkManga: anime.getLink()};
    }
}