import Manga from '../manga';
import {SiteManga} from '../site';
export default class MangaRelou extends Manga {
    special: string;
    
    constructor(manga: any, sites: SiteManga[], special: string) {
        super(manga, sites);
        this.special = special;
    }

    getLink(): string { // Override getLink method so decorated link is correct
        return `${this.getBaseURL()}/scan${this.special}/vf/`;
    }
}