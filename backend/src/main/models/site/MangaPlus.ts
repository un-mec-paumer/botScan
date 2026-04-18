import { GlobalMangaSourceDtoType } from "@dtos/mangas/sources/GlobalMangaSourceDto";
import { ModelSourceManga } from "./source";
import { ModelManga } from "@models/Manga";

export default class MangaPlus implements ModelSourceManga {
    public link = "https://mangaplus.shueisha.co.jp"; // TODO in DB
    public mangaSource: {id: number, name: string};

    constructor(data: GlobalMangaSourceDtoType) {
        this.mangaSource = data.mangaSource;
    }

    idMangaPlus: { [key: number]: string } = {
        64: '700023',
        52: '700005',
        70: '700036'
    }

    async visitSiteManga(manga: ModelManga): Promise<{tabChap: number[], linkManga: string}> {
        const url = `${this.link}/titles/${this.idMangaPlus[manga.id]}`
        // const $ = await getCherrioText(url, browser);

        // const newChap = $(".ChapterListItem-module_name_3h9dj").toArray().map((element) => { 
        //     const text = $(element).text();
        //     return parseFloat(text.replace("#", "").trim());
        // }).filter((nbChap) => {
        //     return nbChap > manga.chapitre
        // });

        // console.log(`MangaPlus: Found new chapters for ${manga.name}: ${newChap}`);
        
        return {tabChap: [0], linkManga: url};
    }
}

