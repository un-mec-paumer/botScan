import Manga from '../manga';
import Site from '../site';
import specRelou from './specRelou';
export default class MangaRelou extends Manga {
    special: specRelou;
    
    constructor(id_manga: number, name_manga: string, chapitre_manga: number, image: string, synopsis: string, sites: Site[], special: specRelou) {
        super(id_manga, name_manga, chapitre_manga, image, synopsis, sites);
        this.special = special;
    }

    getLink(): string {
        return `${this.getBaseURL()}/scan${this.special.content}/vf/`;
    }
}