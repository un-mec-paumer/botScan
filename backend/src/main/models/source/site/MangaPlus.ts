import { ModelSourceManga } from "../source";
import { ModelManga } from "@models/works/manga";

export default class MangaPlus implements ModelSourceManga {
    id: number;
    name: string;
    link = "https://mangaplus.shueisha.co.jp";
   
    constructor(data: {id: number, name: string}) {
        this.id = data.id;
        this.name = data.name;
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

