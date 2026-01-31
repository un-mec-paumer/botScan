import { Browser } from "puppeteer-core";
import { SiteManga } from "./site";
import { animeSamaUrl } from "../variables";

export default class Manga {
    public id: number;
    public name: string;
    public chapitre: number;
    public image: string;
    public synopsis: string;
    private sites: SiteManga[];

    constructor(manga: any, sites: SiteManga[]) {
        this.id = manga.id;
        this.name = manga.name;
        this.chapitre = manga.chapitre;
        this.image = manga.image;
        this.synopsis = manga.synopsis;
        this.sites = sites;
    }

    public async visiteAllSite(browser: Browser) : Promise<{tabChap: number[], linkManga: string}> {
        const results = await Promise.all(this.sites.map((site, i) => site.visitSiteManga(browser, this)));
        const resultFinal = results.filter((result) => result.tabChap.length > 0).sort((a, b) => b.tabChap[b.tabChap.length - 1] - a.tabChap[a.tabChap.length - 1]);
        if (resultFinal.length > 0) return resultFinal[0];
        else return {tabChap: [], linkManga: ""};
    }

    get nbSites(): number {
        return this.sites.length;
    }

    public getBaseURL(): string {
        return `${animeSamaUrl}/catalogue/${this.name}`;
    }

    public getLink(): string {
        return `${this.getBaseURL()}/scan/vf`;
    }

    public toString(): string {
        return `Manga [ID: ${this.id}, Name: ${this.name}, Chapter: ${this.chapitre}]`;
    }
    
    public toJSON(): object {
        return {
            id: this.id,
            name: this.name,
            chapitre: this.chapitre,
            image: this.image,
            synopsis: this.synopsis
        };
    }
}