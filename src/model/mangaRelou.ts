import Manga from './manga';
import specRelou from './specRelou';
export default class MangaRelou extends Manga {
    special: specRelou;
    
    constructor(id_manga: number, name_manga: string, chapitre_manga: number, image: string, synopsis: string, special: specRelou) {
        super(id_manga, name_manga, chapitre_manga, image, synopsis);
        this.special = special;
    }

    getLink(): string {
        return `${this.getBaseURL()}/scan_${this.special.content}/vf`;
    }
}