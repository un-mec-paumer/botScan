import { GlobalAnimeSourceDtoType } from "@dtos/animes/sources/GlobalAnimeSourceDto";
import { ModelSourceAnime, ModelSourceManga } from "./source";
import { ModelAnime } from "@models/Anime";


export default class VoirAnime implements ModelSourceAnime {
    public link = "https://voiranime.com";
    public mangaSource: {id: number, name: string};
    constructor(data: GlobalAnimeSourceDtoType) { // a modifier avec les DTO
        this.mangaSource = data;
    }

    async visitSiteAnime(anime: ModelAnime): Promise<{ tabChap: number[]; linkManga: string; }> {
        const link = `${this.link}/anime/${anime.name}-${Number.parseInt(anime.season) > 1 ? anime.season : ''}${anime.language === 'vf' ? '-vf' : ''}`;
        
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