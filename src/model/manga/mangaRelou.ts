import Manga from '../manga';
import Site from '../site';
export default class MangaRelou extends Manga {
    special: string;
    
    constructor(manga: any, sites: Site[], special: string) {
        super(manga, sites);
        this.special = special;
    }

    getLink(): string { // Override getLink method so decorated link is correct
        return `${this.getBaseURL()}/scan${this.special}/vf/`;
    }
}