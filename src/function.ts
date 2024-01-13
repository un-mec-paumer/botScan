import { Client, CommandInteraction, EmbedBuilder } from "discord.js";
import { writeFileSync, PathOrFileDescriptor } from 'fs';
import { BDD } from "./supabase";
import * as cheerio from 'cheerio';


type Manga = {
    id_manga?: number,
    name_manga?: string,
    chapitre_manga?: number,
    page?: boolean,
    img?: string,
    synopsis?: string
};

type json = {
    args: {
        url: string
    },
    headers: {
        [key: string]: string
    },
    origin: string,
    url: string
};

async function finder(manga: Manga, client: Client) /*Promise<boolean>*/ {

    const urlBase = "https://fr-scan.com/manga/";
    const chap = String(manga.chapitre_manga).replace(".", "-");
    const url: string = `${urlBase + manga.name_manga}/chapitre-${chap}-vf/${(manga.page ? "1000000" : "")}/`;
    // const url: string = `${urlBase + manga.name_manga}/chapitre-1099-vf/1000000/`;
    // console.log(url);


    //console.log(manga.chapitre_manga);

    try {
        const $ = await getCherrioText(url);
        const nextUrl = $(".next_page").attr("href");
        // console.log(urlBase + manga.name_manga + "/chapitre-" + (manga.chapitre_manga) + "-vf/", text.includes(urlBase + manga.name_manga + "/chapitre-" + (manga.chapitre_manga + 1) + "-vf/"));
        //return text.includes(urlBase + manga.name_manga + "/chapitre-" + (manga.chapitre_manga + 1) + "-vf/");
        
        if(nextUrl === undefined || nextUrl === null || nextUrl === "") {
            console.log(`nextUrl : ${nextUrl}`);
            return false;
        }

        console.log("nextUrl ", nextUrl);
        const tab = nextUrl!.split("/")[5].split("-");
        let nbNext = parseFloat(tab[1]);
        if(tab[2] !== "vf") nbNext += parseFloat("0." +parseFloat(tab[2]));
        //console.log(nbNext);

        console.log(`Le chapitre ${nbNext} de ${manga.name_manga} est sorti !`);                    
        await BDD.updateChapitre(manga.name_manga!, nbNext);
        const userBDD = await BDD.getLien(manga.id_manga!);

        userBDD!.forEach(async (user) => {
            const userDiscord = await client.users.fetch(user.id_user);
            userDiscord.send(`Le chapitre ${nbNext} de ${manga.name_manga!.replaceAll("-", " ")} est sorti !`);
            if(tab[2] !== "vf") userDiscord.send(`${urlBase + manga.name_manga}/chapitre-${parseFloat(tab[1])}-${parseFloat(tab[2])}-vf/`);
            else userDiscord.send(`${urlBase + manga.name_manga}/chapitre-${nbNext}-vf/`);
        });
        
    } catch (error) {
        console.log("Veux pas");
        console.error('Error:', error);
        // return false;
    }
}

export async function finderAll(client:Client) {
    console.log("finderAll");
    //const userID = "452370867758956554";

    const mangas = await BDD.getMangas();
    //console.log(mangas)
    mangas!.forEach(manga => {
        finder(manga, client)
    });
}

//* inutilisé
export function sauvegarder(data:string/*, path:PathOrFileDescriptor*/): boolean {
    //console.log("data ", data);
    //let str = JSON.stringify(data);
    const path2: PathOrFileDescriptor = "./src/data/mangas.json";
    writeFileSync(path2, data, "utf-8");
    return true;
}

export async function downloadImg(imgStr:string, name_manga:string): Promise<void> {
    
    const response = await fetch(imgStr, {
        method: 'GET',
        headers: {
            'Content-Type': 'image/png',
        },
    });
    // console.log(response);

    const img = await response.arrayBuffer().then((buffer: ArrayBuffer) => buffer);
    // console.log(img);
    await BDD.addImgToTest(name_manga + ".png", img);
}

export function tabin(message:string, tab:Array<string>): boolean {
    return tab.filter((element) => {return element === message}).length === 1;
}

export async function getCherrioText(url: string) {

    const proxyUrl = `https://httpbin.org/get?url=${encodeURIComponent(url)}`;

    const response = await fetch(proxyUrl, {
        method: 'GET',
        headers: {
            'Content-Type': 'text/html',
            'User-Agent': 'PostmanRuntime/7.32.1',
        },
    });

    const json = await response.json() as json;
    const response2 = await fetch(json.args.url, json.headers)
    const text = await response2.text();

    return cheerio.load(text);
}

export async function getEmbedListeMangas(mangas: any[], interaction: CommandInteraction): Promise<void> {

    mangas?.forEach( async (manga: Manga) => {
        const nom = manga.name_manga?.replaceAll("-", " ") ?? "";
        const synopsis = manga.synopsis ?? "";
        const img = await BDD.getImgFromTest(manga.name_manga!)
        const imgUrl = img?.signedUrl ?? "";


        const embed = new EmbedBuilder()
            .setTitle(nom)
            .setDescription(synopsis.split(" ").slice(0, 50).join(" ") + "...")
            .setImage(imgUrl);

        interaction.followUp({ embeds: [embed] });
    });
}

// downloadImg('https://fr-scan.com/wp-content/uploads/2022/09/shuumatsu_no_valkyrie_ibun_-_ryo_fu_hou_sen_hishouden_vol_3945333-193x278.jpg', "test")

// finderAll();
// downloadImg()
