import { Browser, Page } from "puppeteer-core";
import Site from "./site";
import { animeSamaUrl } from "../variables";
export default class Manga {
    public id_manga: number;
    public name_manga: string;
    public chapitre_manga: number;
    public image: string;
    public synopsis: string;
    private sites: Site[];

    constructor(manga: any, sites: Site[]) {
        this.id_manga = manga.id_manga;
        this.name_manga = manga.name_manga;
        this.chapitre_manga = manga.chapitre_manga;
        this.image = manga.image;
        this.synopsis = manga.synopsis;
        this.sites = sites;
    }

    public async visiteAllSite(browser: Browser) : Promise<{tabChap: number[], linkManga: string}> {
        const results = await Promise.all(this.sites.map((site, i) => site.visitSite(this)));
        const resultFinal = results.filter((result) => result.tabChap.length > 0).sort((a, b) => b.tabChap[b.tabChap.length - 1] - a.tabChap[a.tabChap.length - 1]);
        console.log(`Manga: ${this.name_manga}, Results: ${JSON.stringify(results)}, ResultFinal: ${JSON.stringify(resultFinal)}`);
        if (resultFinal.length > 0) return resultFinal[0];
        else return {tabChap: [], linkManga: ""};
    }

    get nbSites(): number {
        return this.sites.length;
    }

    public getBaseURL(): string {
        return `${animeSamaUrl}/catalogue/${this.name_manga}`;
    }

    public getLink(): string {
        return `${this.getBaseURL()}/scan/vf`;
    }

    public getMangaInfo(): string {
        return `${this.name_manga} (Chapter: ${this.chapitre_manga}) - ${this.synopsis}`;
    }

    public toString(): string {
        return `Manga [ID: ${this.id_manga}, Name: ${this.name_manga}, Chapter: ${this.chapitre_manga}]`;
    }
    
    public toJSON(): object {
        return {
            id_manga: this.id_manga,
            name_manga: this.name_manga,
            chapitre_manga: this.chapitre_manga,
            image: this.image,
            synopsis: this.synopsis
        };
    }
}