import { SourceDtoInterfaceAnime } from "./source";
import { DisplayAnimeDtoType } from "@dtos/animes/DisplayAnimeDto";


export default class VoirAnime implements SourceDtoInterfaceAnime {
    id: number;
    name: string;
    link = "https://voiranime.com";

    constructor(data: {id: number, name: string}) {
        this.id = data.id;
        this.name = data.name;
    }

    async visitSiteAnime(anime: DisplayAnimeDtoType): Promise<{ tabChap: number[]; linkManga: string; }> {
        const link = `${this.link}/anime/${anime.name}-${anime.season > 1 ? anime.season : ''}${anime.language === 'vf' ? '-vf' : ''}`;
        
        // const $ = await getCherrioText(link);
        
        // const newEp = $('.wp-manga-chapter    ').toArray().map((element) => { return $(element).find('a').attr('href') })
        // .map((title) => { 
        //     const splited = title!.split('-');
        //     return parseFloat(splited[splited.length - (anime.language === 'vf' ? 2 : 1)]);
        // }).filter((ep) => {
        //     // console.log(`Checking episode title: ${ep}`);
        //     return ep > anime.episode;
        // })
        // console.log(`${this.name}: Found new episodes for ${anime.name}: ${newEp}`);

        return {tabChap: [0], linkManga: link};
    }
}