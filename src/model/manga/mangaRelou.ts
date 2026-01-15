import Manga from '../manga';
import Site from '../site';
import specRelou from './specRelou';
export default class MangaRelou extends Manga {
    special: specRelou;
    
    constructor(manga: any, sites: Site[], special: specRelou) {
        super(manga, sites);
        this.special = special;
    }

    getLink(): string {
        return `${this.getBaseURL()}/scan${this.special.content}/vf/`;
    }
}