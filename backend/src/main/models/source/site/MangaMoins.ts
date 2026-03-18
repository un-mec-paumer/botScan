import { ModelSourceManga } from "../source";
import { ModelManga } from "@models/works/manga";

export default class MangaMoins implements ModelSourceManga {
    id: number;
    name: string;
    link = "https://mangamoins.com/";

    constructor(data: {id: number, name: string}) {
        this.id = data.id;
        this.name = data.name;
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