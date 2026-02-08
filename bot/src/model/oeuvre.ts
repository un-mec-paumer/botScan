import { Browser } from "puppeteer-core";
import { animeSamaUrl } from "../variables";

export default abstract class Oeuvre {
    public id: number;
    public name: string;
    public image: string;
    public synopsis: string;

    constructor(oeuvre: any) {
        this.id = oeuvre.id;
        this.name = oeuvre.name;
        this.image = oeuvre.image;
        this.synopsis = oeuvre.synopsis;
    }

    abstract visiteAllSite(browser: Browser) : Promise<{tabChap: number[], linkManga: string}>;
    abstract toString(): string;
    abstract toJSON(): object;

    public getBaseURL(): string {
        return `${animeSamaUrl}/catalogue/${this.name}`;
    }
}