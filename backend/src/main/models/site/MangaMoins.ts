import { GlobalMangaSourceDtoType } from "@dtos/mangas/sources/GlobalMangaSourceDto";
import { ModelSourceManga } from "./source";
import { ModelManga } from "@models/Manga";

export default class MangaMoins implements ModelSourceManga {
    public link = "https://mangamoins.com/"; // TODO in DB
    public mangaSource: {id: number, name: string};
    
    constructor(data: GlobalMangaSourceDtoType) {
        this.mangaSource = data.mangaSource;
    }
    
    async visitSiteManga(manga: ModelManga): Promise<{tabChap: number[], linkManga: string}> {
        
            // const $ = await getCherrioText(this.link, browser);

            // const newChap = $('.sortie').toArray().filter((element) => { 
            //     return $(element).text().toLocaleLowerCase().includes(manga.name.replaceAll('-', ' '));
            // }).map((element) => {
            //     const text = $(element).find('h3').text();
            //     return parseFloat(text.replace('#', "").trim());
            // }).filter((nbChap) => {
            //     return nbChap > manga.chapitre
            // });

        // console.log(`MangaMoins: Found new chapters for ${manga.name}: ${newChap}`);
        
        return {tabChap: [0], linkManga: this.link}; // TODO: mock a change plus tard
    }
}