// import { SiteManga } from "../site";
// import Manga from "../manga";
// import { Browser } from "puppeteer-core";
// import { getCherrioText } from "../../function";

import { SourceDtoInterfaceManga } from "./source";
import { DisplayMangaDtoClass } from "@dtos/mangas/DisplayMangaDto";

export default class MangaPlus implements SourceDtoInterfaceManga {
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

    async visitSiteManga(manga: DisplayMangaDtoClass): Promise<{tabChap: number[], linkManga: string}> {
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

