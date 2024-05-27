import { Client, CommandInteraction, EmbedBuilder } from "discord.js";
import { writeFileSync, PathOrFileDescriptor } from 'fs';
import { BDD } from "./supabase";
import * as cheerio from 'cheerio';
import puppeteer from "puppeteer";


type Manga = {
    id_manga?: number,
    name_manga?: string,
    chapitre_manga?: number,
    page?: boolean,
    img?: string,
    synopsis?: string
};

// type json = {
//     args: {
//         url: string
//     },
//     headers: {
//         [key: string]: string
//     },
//     origin: string,
//     url: string
// };

async function finder(manga: Manga, client:Client) /*Promise<boolean>*/ {

    const RELOUDEMERDE = ["one-piece"]
    const urlBase = "https://anime-sama.fr/catalogue/";
    const chap = String(manga.chapitre_manga).replace(".", "-");
    const url: string = `${urlBase + manga.name_manga}/scan${RELOUDEMERDE.includes(manga.name_manga!) ? "_noir-et-blanc":""}/vf/`;
    // const url: string = `${urlBase + manga.name_manga}/chapitre-1099-vf/1000000/`;
    // console.log(url);


    // console.log(manga.name_manga);

    try {
        const $ = await getCherrioText(url);
        // console.log($.html());
        const newChap = $("#selectChapitres option").toArray().map((element) => { return $(element).attr("value") }).filter((element) => { 
            const nbChap = parseFloat(element!.split(" ")[1])
            return nbChap > manga.chapitre_manga!
        }).map((element) => { return parseFloat(element!.split(" ")[1])});

        // console.log(newChap);

        if(newChap.length === 0) {
            // console.log(`nextUrl : ${nextUrl}`);
            return false;
        }
               
        await BDD.updateChapitre(manga.name_manga!, newChap[newChap.length - 1]);
        const userBDD = await BDD.getLien(manga.id_manga!);

        userBDD!.forEach(async (user) => {
            const userDiscord = await client.users.fetch(user.id_user);
            if (newChap.length === 1) userDiscord.send(`Le chapitre ${newChap[0]} de ${manga.name_manga!.replaceAll("-", " ")} est sorti !\n${url}`);
            else userDiscord.send(`Les chapitres ${newChap[0]} à ${newChap[newChap.length - 1]} de ${manga.name_manga!.replaceAll("-", " ")} sont sortis !\n${url}`);
        });

        return true;
        
    } catch (error) {
        console.log("Veux pas");
        console.error(manga.name_manga!);
        console.error('Error:', error);
        return false;
    }
}


export async function finderAll(client: Client) {
    console.log("finderAll");
    //const userID = "452370867758956554";

    const mangas = await BDD.getMangas();
    // console.log(mangas)
    // let res = false;
    mangas!.forEach(async manga => {
        await finder(manga, client);
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
    const browser = await puppeteer.launch({
        headless: true,
        args: [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-dev-shm-usage",
            "--disable-accelerated-2d-canvas",
            "--disable-gpu",
            "--window-size=1920x1080",
        ],
        executablePath: process.env.CHROME_PATH!
    });
    const page = await browser.newPage();

    // Bloquer les ressources inutiles
    await page.setRequestInterception(true);
    page.on('request', (req) => {
        const resourceType = req.resourceType();
        const expectedResourceTypes = ['other', "image", "stylesheet", "font", "media", "texttrack", "xhr", "fetch", "other"];
        if (expectedResourceTypes.includes(resourceType)) {
            req.abort();
        } else {
            req.continue();
        }
    });

    await page.goto(url, { 
        waitUntil: 'load', 
        //timeout: 60000,
    });
    const html = await page.content();

    await page.close();
    await browser.close();

    return cheerio.load(html);
}

// getCherrioText("https://anime-sama.fr/catalogue/one-piece/scan/vf/").then((res) => {
//     // console.log(res.html());
//     console.log(res("#selectChapitres option").toString())
// }).catch((e) => {
//     console.error(e)
// })

export async function getEmbedListeMangas(mangas: any[], interaction: CommandInteraction): Promise<void> {
    const RELOUDEMERDE = ["one-piece"]
    mangas?.forEach( async (manga: Manga) => {
        const nom = manga.name_manga?.replaceAll("-", " ") ?? "";
        const synopsis = manga.synopsis ?? "";
        const img = await BDD.getImgFromTest(manga.name_manga!)
        const imgUrl = img?.signedUrl ?? "";

        

        const embed = new EmbedBuilder()
            .setTitle(nom)
            .setURL(`https://anime-sama.fr/catalogue/${manga.name_manga}/scan${RELOUDEMERDE.includes(manga.name_manga!) ? "_noir-et-blanc":""}/vf/`)
            .setDescription(
                "***Chapitre n° " + manga.chapitre_manga + "*** \n" +
                synopsis.split(" ").slice(0, 50).join(" ") + "..."
            )
            .setImage(imgUrl);

        interaction.followUp({ embeds: [embed] });
    });
}

// downloadImg('https://fr-scan.com/wp-content/uploads/2022/09/shuumatsu_no_valkyrie_ibun_-_ryo_fu_hou_sen_hishouden_vol_3945333-193x278.jpg', "test")

// finderAll();
// downloadImg()
