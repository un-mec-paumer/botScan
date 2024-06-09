import { Client, CommandInteraction, EmbedBuilder } from "discord.js";
import { writeFileSync, PathOrFileDescriptor } from 'fs';
import { BDD } from "./supabase";
import * as cheerio from 'cheerio';
import puppeteer, { Page } from 'puppeteer-core';

type Manga = {
    id_manga?: number,
    name_manga?: string,
    chapitre_manga?: number,
    page?: boolean,
    img?: string,
    synopsis?: string
};

export async function initBrowser() {
    const browser = await puppeteer.launch({
        headless: true,
        args: [
            '--no-sandbox', 
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
        ],
        executablePath: process.env.CHROME_PATH
    });

    const page = await browser.newPage();
    await page.setRequestInterception(true);
    page.on('request', (req) => {
        const resourceType = req.resourceType();
        const expectedResourceTypes = ["image", "stylesheet", "font", "media"];
        if (expectedResourceTypes.includes(resourceType)) {
            req.abort();
        } else {
            req.continue();
        }
    });
    return {browser, page}
}

async function finder(manga: Manga, client:Client, page:Page) /*Promise<boolean>*/ {

    const RELOUDEMERDE = ["one-piece"]
    const urlBase = "https://anime-sama.fr/catalogue/";
    const chap = String(manga.chapitre_manga).replace(".", "-");
    const url: string = `${urlBase + manga.name_manga}/scan${RELOUDEMERDE.includes(manga.name_manga!) ? "_noir-et-blanc":""}/vf/`;
    // const url: string = `${urlBase + manga.name_manga}/chapitre-1099-vf/1000000/`;
    // console.log(url);


    // console.log(manga.name_manga);

    try {
        const $ = await getCherrioText(url, page);
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
            if (newChap.length === 1) await userDiscord.send(`Le chapitre ${newChap[0]} de ${manga.name_manga!.replaceAll("-", " ")} est sorti !\n${url}`);
            else if (newChap.length === 2) await userDiscord.send(`Les chapitres ${newChap[0]} et ${newChap[1]} de ${manga.name_manga!.replaceAll("-", " ")} sont sortis !\n${url}`);
            else await userDiscord.send(`Les chapitres ${newChap[0]} à ${newChap[newChap.length - 1]} de ${manga.name_manga!.replaceAll("-", " ")} sont sortis !\n${url}`);
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
    const {browser, page} = await initBrowser();
    const mangas = await BDD.getMangas();
    
    for (const manga of mangas!) {
        try {
            const res = await finder(manga, client, page);
            // if(!res) console.log(`Pas de nouveau chapitre pour ${manga.name_manga}`);
        } catch (error) {
            console.error(error);
        }
    }

    await page.close();
    await browser.close();
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

export async function getCherrioText(url: string, page:Page) {
    try {
        await page.goto(url, {
            waitUntil: 'load',
            timeout: 450000
        });
        await page.waitForSelector('#selectChapitres');
        const html = await page.content();

        return cheerio.load(html);
    } catch (error) {
        console.error(error);
        return cheerio.load("");
    }
}

export async function endErasmus(client: Client): Promise<void> {
    const now = new Date();
    const end = new Date("2024-06-13");
    const nbjours = end.getDate() - now.getDate();
    console.log(endErasmus.name);
    
    if([11].includes(now.getHours())) {
        for (const id of ["452370867758956554", "411190739771326465"]) {
            const user = await client.users.fetch(id);
            if (user.dmChannel === null) await user.createDM();
            const messages = (await user.dmChannel?.messages.fetch())?.filter((message) => message.content.includes("la fin de ton erasmus est dans") && message.author.id === client.user?.id).map((message) => message.content) ?? [""];
            
            // console.log(messages);

            const nbJoursMsg = messages[0].split(" ").map((element) => parseInt(element)).filter((element) => !isNaN(element))[0]
            // console.log(nbJoursMsg);
            if(nbJoursMsg < nbjours) await user.send(`Salut ${user} la fin de ton erasmus est dans ${nbjours} jour${nbjours !== 1 ? "s":""} !`);
        }
    }
}
// endErasmus();

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
