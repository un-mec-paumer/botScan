import { ModelSourceManga, ModelSourceAnime } from "./source";
import { ModelManga } from "@models/Manga";
import { ModelAnime } from "@models/Anime";
import { GlobalMangaSourceDtoType } from "@dtos/mangas/sources/GlobalMangaSourceDto";

export default class AnimeSama implements ModelSourceManga, ModelSourceAnime {
    public mangaSource: {id: number, name: string};

    
    constructor(data: GlobalMangaSourceDtoType) {
        this.mangaSource = data.mangaSource;
    }


    async visitSiteManga(manga: ModelManga): Promise<{tabChap: number[], linkManga: string}> {

        // const $ = await getCherrioText(manga.getLink(), browser);

        // const newChap = $("#selectChapitres option").toArray().map((element) => { return $(element).attr("value") }).filter((element) => {
        //     const nbChap = parseFloat(element!.split(" ")[1])
        //     // console.log(`Found chapter option: ${element}, parsed chapter number: ${nbChap}`);
        //     return nbChap > manga.chapitre
        // }).map((element) => { return parseFloat(element!.split(" ")[1]) });

        // console.log(`${this.name}: Found new chapters for ${manga.name}: ${newChap}`);
        return {tabChap: [0], linkManga: this.link}; // TODO: mock a change plus tard
    }

    async visitSiteAnime(anime: ModelAnime): Promise<{tabChap: number[], linkManga: string}> {
        // const $ = await getCherrioText(anime.getLink(), browser);

        // const newEp = $("#selectEpisodes option").toArray().map((element) => { return $(element).attr("value") }).filter((element) => {
        //     const nbEp = parseFloat(element!.split(" ")[1])
        //     // console.log(`Found chapter option: ${element}, parsed chapter number: ${nbChap}`);
        //     return nbEp > anime.episode
        // }).map((element) => { return parseFloat(element!.split(" ")[1]) });

        // console.log(`${this.name}: Found new chapters for ${manga.name}: ${newChap}`);
        return {tabChap: [0], linkManga: this.link}; // TODO: mock a change plus tard
    }
}