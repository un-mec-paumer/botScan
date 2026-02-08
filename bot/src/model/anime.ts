import Oeuvre from "./oeuvre";
import { Browser } from "puppeteer-core";
import { SiteAnime } from "./site";

export default class Anime extends Oeuvre {
    public episode: number;
    public saison: number;
    public language: string;
    private sites: SiteAnime[];


    constructor(anime: any, sites: SiteAnime[]) {
        super(anime);
        this.episode = anime.episode;
        this.saison = anime.saison;
        this.language = anime.language;
        this.sites = sites;
    }
    
    public async visiteAllSite(browser: Browser): Promise<{tabChap: number[], linkManga: string}> {
        const results = await Promise.all(this.sites.map((site, i) => site.visitSiteAnime(browser, this)));
        const resultFinal = results.filter((result) => result.tabChap.length > 0).sort((a, b) => b.tabChap[b.tabChap.length - 1] - a.tabChap[a.tabChap.length - 1]);
        if (resultFinal.length > 0) return resultFinal[0];
        else return {tabChap: [], linkManga: ""};
    }

    getLink(): string {
        return `${this.getBaseURL()}/saison${this.saison}/${this.language}`;
    }

    public toString(): string {
        return `Anime [ID: ${this.id}, Name: ${this.name}, Episode: ${this.episode}, Season: ${this.saison}]`;
    }
    
    public toJSON(): object {
        return {
            id: this.id,
            name: this.name,
            image: this.image,
            synopsis: this.synopsis,
            episode: this.episode,
            saison: this.saison,
            language: this.language
        };
    }
}
