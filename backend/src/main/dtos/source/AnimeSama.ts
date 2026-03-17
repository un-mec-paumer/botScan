import { SourceDtoInterfaceAnime, SourceDtoInterfaceManga } from "./source";
import { DisplayMangaDtoClass } from "@dtos/mangas/DisplayMangaDto";
import { DisplayAnimeDtoType } from "@dtos/animes/DisplayAnimeDto";

export default class AnimeSama implements SourceDtoInterfaceManga, SourceDtoInterfaceAnime {
    id: number;
    name: string;
    link = "https://anime-sama.to/";

    constructor(data: {id: number, name: string}) {
        this.id = data.id;
        this.name = data.name;
    }


    async visitSiteManga(manga: DisplayMangaDtoClass): Promise<{tabChap: number[], linkManga: string}> {

        // const $ = await getCherrioText(manga.getLink(), browser);

        // const newChap = $("#selectChapitres option").toArray().map((element) => { return $(element).attr("value") }).filter((element) => {
        //     const nbChap = parseFloat(element!.split(" ")[1])
        //     // console.log(`Found chapter option: ${element}, parsed chapter number: ${nbChap}`);
        //     return nbChap > manga.chapitre
        // }).map((element) => { return parseFloat(element!.split(" ")[1]) });

        // console.log(`${this.name}: Found new chapters for ${manga.name}: ${newChap}`);
        return {tabChap: [0], linkManga: this.link}; // TODO: mock a change plus tard
    }

    async visitSiteAnime(anime: DisplayAnimeDtoType): Promise<{tabChap: number[], linkManga: string}> {
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