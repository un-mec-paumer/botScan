import { SiteAnime } from "../site";
import Anime from "../anime";
import { Browser } from "puppeteer-core";
import { getCherrioText } from "../../function";

export default class VoirAnime implements SiteAnime {
    name = "VoirAnime";
    link = "https://voiranime.com";

    async visitSiteAnime(browser: Browser, anime: any): Promise<{ tabChap: number[]; linkManga: string; }> {
        const link = `${this.link}/anime/${anime.name}-${anime.saison > 1 ? anime.saison : ''}${anime.language === 'vf' ? '-vf' : ''}`;
        
        const $ = await getCherrioText(link, browser);
        
        const newEp = $('.wp-manga-chapter    ').toArray().map((element) => { return $(element).find('a').attr('href') })
        .map((title) => { 
            const splited = title!.split('-');
            return parseFloat(splited[splited.length - (anime.language === 'vf' ? 2 : 1)]);
        }).filter((ep) => {
            // console.log(`Checking episode title: ${ep}`);
            return ep > anime.episode;
        })
        console.log(`${this.name}: Found new episodes for ${anime.name}: ${newEp}`);

        return {tabChap: newEp, linkManga: link};
    }
}