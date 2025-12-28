export default class Manga {
    id_manga: number;
    name_manga: string;
    chapitre_manga: number;
    image: string;
    synopsis: string;

    constructor(id_manga: number, name_manga: string, chapitre_manga: number, image: string, synopsis: string) {
        this.id_manga = id_manga;
        this.name_manga = name_manga;
        this.chapitre_manga = chapitre_manga;
        this.image = image;
        this.synopsis = synopsis;
    }

    getBaseURL(): string {
        return `https://anime-sama.tv/catalogue/${this.name_manga}`;
    }

    getLink(): string {
        return `${this.getBaseURL()}/scan/vf`;
    }

    getMangaInfo(): string {
        return `${this.name_manga} (Chapter: ${this.chapitre_manga}) - ${this.synopsis}`;
    }

    toString(): string {
        return `Manga [ID: ${this.id_manga}, Name: ${this.name_manga}, Chapter: ${this.chapitre_manga}]`;
    }
    
    toJSON(): object {
        return {
            id_manga: this.id_manga,
            name_manga: this.name_manga,
            chapitre_manga: this.chapitre_manga,
            image: this.image,
            synopsis: this.synopsis
        };
    }
}